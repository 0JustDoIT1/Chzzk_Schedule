import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'node:crypto';
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

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private readonly submissions: Model<SubmissionDocument>,
    private readonly streamers: StreamerService,
    private readonly schedules: ScheduleService,
  ) {}

  private async create(kind: SubmissionKind, payload: Record<string, unknown>, sourceUrl: string, targetScheduleId?: string) {
    const saved = await this.submissions.create({
      kind,
      status: 'pending',
      payload,
      sourceUrl,
      receiptToken: randomBytes(24).toString('hex'),
      ...(targetScheduleId ? { targetScheduleId: new Types.ObjectId(targetScheduleId) } : {}),
    });
    return { id: saved.receiptToken, status: saved.status };
  }

  submitStreamer(input: StreamerSubmissionDto) {
    if (input.streamer.isOfficial) throw new BadRequestException('Official classification is admin only');
    return this.create('streamer', { ...input.streamer }, input.sourceUrl);
  }

  async submitSchedule(input: ScheduleSubmissionDto) {
    if (input.schedule.isOfficial || [AllCategory.OFFICIAL, AllCategory.WATCH].includes(input.schedule.category)) {
      throw new BadRequestException('Official classification is admin only');
    }
    if (input.targetScheduleId) {
      await this.schedules.getScheduleById(input.targetScheduleId);
    }
    return this.create(input.targetScheduleId ? 'schedule-edit' : 'schedule', { ...input.schedule }, input.sourceUrl, input.targetScheduleId);
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

  async approve(id: string, input: ApproveSubmissionDto) {
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

  async reject(id: string, reason: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid submission id');
    const updated = await this.submissions.findOneAndUpdate(
      { _id: id, status: 'pending' },
      { $set: { status: 'rejected', reason, reviewedAt: new Date() } },
      { new: true },
    ).exec();
    if (!updated) throw new NotFoundException('Pending submission not found');
    return { id: updated.id as string, status: updated.status };
  }
}
