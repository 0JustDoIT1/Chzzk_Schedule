import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createHmac, randomBytes } from 'node:crypto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Submission, SubmissionDocument, SubmissionKind } from './submission.schema';
import { StreamerSubmissionDto, ScheduleSubmissionDto, ApproveSubmissionDto } from './submission.dto';
import { StreamerService } from '../streamer/streamer.service';
import { ScheduleService } from '../schedule/schedule.service';
import type { PublicationEvidence } from '../schedule/schedule.service';
import { CreateScheduleDto } from '../schedule/dto/create-schedule.dto';
import { CreateStreamerDto } from '../streamer/dto/create-streamer.dto';
import { AllCategory, OfficialName } from '@shared/constants';
import { SubmissionLimit } from './submission-limit.schema';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REPORTS = 10;
const rateLimitError = () => new HttpException('제보 요청이 많습니다. 잠시 후 다시 시도해 주세요.', HttpStatus.TOO_MANY_REQUESTS);

function duplicateKey(kind: SubmissionKind, payload: Record<string, unknown>, targetScheduleId?: string): string {
  const normalized = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (kind === 'streamer') return `streamer:${normalized(payload.chzzkLink).replace(/\/+$/, '')}`;
  if (kind === 'schedule-edit') return `schedule-edit:${targetScheduleId}`;
  return `schedule:${normalized(payload.streamerName)}:${normalized(payload.title)}:${new Date(String(payload.startAt)).toISOString()}`;
}

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private readonly submissions: Model<SubmissionDocument>,
    @InjectModel(SubmissionLimit.name) private readonly limits: Model<SubmissionLimit>,
    private readonly streamers: StreamerService,
    private readonly schedules: ScheduleService,
  ) {}

  private async create(kind: SubmissionKind, payload: Record<string, unknown>, sourceUrl: string, clientIp: string, targetScheduleId?: string) {
    const secret = process.env.ADMIN_WRITE_TOKEN;
    if (!secret || secret.length < 32) throw new ServiceUnavailableException('Submission protection is not configured');
    const hash = (value: string) => createHmac('sha256', secret).update(value).digest('hex');
    const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;
    const key = hash(`${windowStart}:${clientIp}`);
    try {
      const limit = await this.limits.findOneAndUpdate(
        { key, count: { $lt: MAX_REPORTS } },
        { $inc: { count: 1 }, $setOnInsert: { key, expiresAt: new Date(windowStart + 2 * WINDOW_MS) } },
        { upsert: true, new: true },
      ).exec();
      if (!limit) throw rateLimitError();
    } catch (error) {
      if ((error as { code?: number }).code === 11000) throw rateLimitError();
      throw error;
    }
    const fingerprint = hash(duplicateKey(kind, payload, targetScheduleId));
    try {
      const saved = await this.submissions.create({
        kind, status: 'pending', payload, sourceUrl, fingerprint,
        receiptToken: randomBytes(24).toString('hex'),
        ...(targetScheduleId ? { targetScheduleId: new Types.ObjectId(targetScheduleId) } : {}),
      });
      return { id: saved.receiptToken, status: saved.status };
    } catch (error) {
      if ((error as { code?: number }).code === 11000) throw new ConflictException('동일한 제보가 검수 대기 중입니다.');
      throw error;
    }
  }

  submitStreamer(input: StreamerSubmissionDto, clientIp = 'unknown') {
    if (input.streamer.isOfficial) throw new BadRequestException('Official classification is admin only');
    return this.create('streamer', { ...input.streamer }, input.sourceUrl, clientIp);
  }

  async submitSchedule(input: ScheduleSubmissionDto, clientIp = 'unknown') {
    if (input.schedule.isOfficial || [AllCategory.OFFICIAL, AllCategory.WATCH].includes(input.schedule.category)) {
      throw new BadRequestException('Official classification is admin only');
    }
    if (input.targetScheduleId) {
      await this.schedules.getScheduleById(input.targetScheduleId);
    }
    return this.create(input.targetScheduleId ? 'schedule-edit' : 'schedule', { ...input.schedule }, input.sourceUrl, clientIp, input.targetScheduleId);
  }

  listPending() {
    return this.submissions.find({ status: 'pending' }).sort({ createdAt: 1 }).lean().exec();
  }

  async getStatus(id: string) {
    if (!/^[0-9a-f]{48}$/i.test(id)) throw new BadRequestException('Invalid receipt token');
    const submission = await this.submissions.findOne({ receiptToken: id }).select('status').lean().exec();
    if (!submission) throw new NotFoundException('Submission not found');
    return { id, status: submission.status === 'processing' ? 'pending' : submission.status };
  }

  async approve(id: string, input: ApproveSubmissionDto, actor?: string) {
    const reviewer = actor ?? process.env.ADMIN_REVIEW_USERNAME;
    if (!reviewer) throw new ServiceUnavailableException('Admin account is not configured');
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid submission id');
    const submission = await this.submissions.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { $set: { status: 'processing' } },
      { new: true },
    ).exec();
    if (!submission) throw new ConflictException('Submission unavailable or already reviewed');

    try {
      const payload = this.validatePublication(submission.kind, input);
      const reviewedAt = new Date();
      const note = input.changeNote?.trim() || (submission.kind === 'schedule' ? '최초 게시' : '');
      if (submission.kind === 'schedule-edit' && !note) {
        throw new BadRequestException('수정 내용을 요약해 주세요.');
      }
      const evidence: PublicationEvidence = { sourceUrl: input.sourceUrl, note, reviewedAt };
      if (submission.kind === 'streamer') {
        await this.streamers.create(payload as any);
      } else {
        const schedule = { ...payload };
        // Public detail currently renders HTML. Publish plain escaped text until a sanitizer is added.
        if (typeof schedule.contents === 'string') {
          schedule.contents = schedule.contents.replace(/<[^>]*>/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        if (submission.kind === 'schedule') {
          await this.schedules.create(schedule as any, evidence);
        } else {
          if (!submission.targetScheduleId) throw new BadRequestException('Missing target schedule');
          await this.schedules.updateSchedule(submission.targetScheduleId.toString(), schedule as any, evidence);
        }
      }

      submission.status = 'approved';
      submission.payload = payload;
      submission.sourceUrl = input.sourceUrl;
      submission.reviewedAt = reviewedAt;
      submission.reviewedBy = reviewer;
      await submission.save();
      return { id: submission.id as string, status: submission.status };
    } catch (error) {
      submission.status = 'pending';
      await submission.save();
      throw error;
    }
  }

  private validatePublication(kind: SubmissionKind, input: ApproveSubmissionDto): Record<string, unknown> {
    const dto = kind === 'streamer'
      ? plainToInstance(CreateStreamerDto, input.payload)
      : plainToInstance(CreateScheduleDto, input.payload);
    const errors = validateSync(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) throw new BadRequestException('게시 내용의 형식이 올바르지 않습니다.');

    const payload = { ...input.payload };
    const isOfficial = payload.isOfficial === true;
    if (isOfficial && !input.officialConfirmed) {
      throw new BadRequestException('공식 출처 확인이 필요합니다.');
    }
    if (kind !== 'streamer') {
      if (kind === 'schedule' && payload.status === 'cancelled') {
        throw new BadRequestException('취소는 게시된 일정의 수정으로 처리해 주세요.');
      }
      const officialCategory = payload.category === AllCategory.OFFICIAL || payload.category === AllCategory.WATCH;
      if (isOfficial !== officialCategory) {
        throw new BadRequestException('공식 여부와 방송 종류가 일치하지 않습니다.');
      }
      if (officialCategory) {
        payload.streamerName = payload.category === AllCategory.WATCH ? OfficialName.WATCH : OfficialName.OFFICIAL;
      }
    }
    return payload;
  }

  async reject(id: string, reason: string, actor?: string) {
    const reviewer = actor ?? process.env.ADMIN_REVIEW_USERNAME;
    if (!reviewer) throw new ServiceUnavailableException('Admin account is not configured');
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid submission id');
    const updated = await this.submissions.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { $set: { status: 'rejected', reason, reviewedAt: new Date(), reviewedBy: reviewer } },
      { new: true },
    ).exec();
    if (!updated) throw new NotFoundException('Pending submission not found');
    return { id: updated.id as string, status: updated.status };
  }
}
