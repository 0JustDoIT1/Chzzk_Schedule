import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule, ScheduleDocument, ScheduleRevision } from 'src/schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { StreamerService } from 'src/streamer/streamer.service';
import { ScheduleValidate } from './schedule.validate';
import { IDateSchedule, TMonthSchedule } from 'src/lib/types/schedule.type';
import { StreamerDocument } from 'src/schemas/streamer.schema';
import {
  addDate,
  dateToFormatString,
  dateTypeToDate,
  getDayjs,
  getStartDate,
  isBeforeDate,
  isSameDate,
  TDayjsType,
} from '@shared/utils';
import { OfficialName } from '@shared/constants';

export interface PublicationEvidence {
  note: string;
  reviewedAt: Date;
}

const trackedFields = [
  'isOfficial', 'streamerName', 'category', 'title', 'member',
  'fullDay', 'startTimeKnown', 'endTimeKnown', 'status', 'startAt', 'endAt', 'contents',
] as const;

const sameTrackedValue = (field: typeof trackedFields[number], before: unknown, after: unknown) => {
  if (field === 'startAt' || field === 'endAt') {
    return new Date(before as string | Date).getTime() === new Date(after as string | Date).getTime();
  }
  return JSON.stringify(before) === JSON.stringify(after);
};

const assertObjectId = (id: string) => {
  if (!/^[0-9a-f]{24}$/i.test(id)) throw new BadRequestException('일정 또는 스트리머 ID 형식이 올바르지 않습니다.');
};

const assertKstDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new BadRequestException('날짜 형식이 올바르지 않습니다.');
  const parsed = new Date(`${date}T00:00:00+09:00`);
  if (!Number.isFinite(parsed.getTime()) ||
      new Date(parsed.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) !== date) {
    throw new BadRequestException('날짜 형식이 올바르지 않습니다.');
  }
};

export const plainScheduleContents = (contents?: string): string | undefined => {
  if (contents === undefined) return undefined;
  return contents.replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&nbsp;/gi, ' ')
    .trim();
};

const validateScheduleTime = (data: CreateScheduleDto) => {
  const start = new Date(data.startAt).getTime();
  const end = new Date(data.endAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    throw new BadRequestException('일정 시작·종료 시각을 확인해 주세요.');
  }
  if (data.fullDay && (data.startTimeKnown === false || data.endTimeKnown === false)) {
    throw new BadRequestException('종일 일정에 시간 미정을 함께 지정할 수 없습니다.');
  }
  if (data.endTimeKnown === false && end !== start) {
    throw new BadRequestException('종료 미정 일정의 종료 기준은 시작 시각과 같아야 합니다.');
  }
  if (data.startTimeKnown === false && new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(start)) !== '00:00') {
    throw new BadRequestException('시작 시간 미정 일정의 날짜 기준은 한국 시간 00:00이어야 합니다.');
  }
};

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private streamerService: StreamerService,
    private scheduleValidate: ScheduleValidate,
  ) {}

  async create(scheduleData: CreateScheduleDto, evidence?: PublicationEvidence, submissionId?: Types.ObjectId): Promise<ScheduleDocument> {
    validateScheduleTime(scheduleData);
    if (submissionId) {
      const published = await this.scheduleModel.findOne({ publicationSubmissionId: submissionId }).exec();
      if (published) return published;
    }
    const streamer = await this.streamerService.getStreamerByName(scheduleData.streamerName);
    const members = await this.resolveMembers(streamer.name, scheduleData.member);
    try {
      await this.validateDuplicateSchedule(streamer.name, scheduleData.title, scheduleData.startAt);
    } catch (error) {
      if (submissionId) {
        const published = await this.scheduleModel.findOne({ publicationSubmissionId: submissionId }).exec();
        if (published) return published;
      }
      throw error;
    }

    const createData: Schedule = {
      ...scheduleData,
      streamerId: streamer._id,
      chzzkLink: streamer.chzzkLink,
      member: members.map((member) => member.name),
      memberIds: members.map((member) => member._id),
      contents: plainScheduleContents(scheduleData.contents),
      ...(submissionId ? { publicationSubmissionId: submissionId } : {}),
      ...(evidence ? {
        revisionHistory: [{ version: 1, reviewedAt: evidence.reviewedAt, note: evidence.note, changedFields: [],
          ...(submissionId ? { submissionId } : {}) }],
      } : {}),
    };
    try {
      return await this.scheduleModel.create(createData);
    } catch (error) {
      if (submissionId && (error as { code?: number }).code === 11000) {
        const published = await this.scheduleModel.findOne({ publicationSubmissionId: submissionId }).exec();
        if (published) return published;
      }
      throw error;
    }
  }

  // Update schedule
  async updateSchedule(
    id: string,
    scheduleData: CreateScheduleDto,
    evidence?: PublicationEvidence,
    submissionId?: Types.ObjectId,
  ): Promise<ScheduleDocument> {
    assertObjectId(id);
    validateScheduleTime(scheduleData);
    if (submissionId) {
      const published = await this.scheduleModel.findOne({ _id: id, 'revisionHistory.submissionId': submissionId }).exec();
      if (published) return published;
    }
    const existSchedule = await this.scheduleModel.findById(id).exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleNotFound(existSchedule);

    const streamer = await this.streamerService.getStreamerByName(
      scheduleData.streamerName,
    );
    const members = await this.resolveMembers(streamer.name, scheduleData.member);

    // Legacy participant copies must be reconciled before a single-document edit.
    const legacyCopy = await this.scheduleModel.findOne({
      _id: { $ne: id },
      title: existSchedule.title,
      startAt: existSchedule.startAt,
      streamerId: { $ne: existSchedule.streamerId },
      $or: [
        { streamerName: { $in: existSchedule.member ?? [] } },
        { member: existSchedule.streamerName },
      ],
    }).exec();
    if (legacyCopy) {
      throw new ConflictException('기존 합방 복제 일정은 정리 후 수정할 수 있습니다.');
    }

    // validate schedule already exist
    await this.validateDuplicateSchedule(
      streamer.name,
      scheduleData.title,
      scheduleData.startAt,
      id,
    );

    const updateData: Schedule = {
      ...scheduleData,
      streamerId: streamer._id,
      chzzkLink: streamer.chzzkLink,
      member: members.map((member) => member.name),
      memberIds: members.map((member) => member._id),
      contents: plainScheduleContents(scheduleData.contents),
    };

    const revision: ScheduleRevision | undefined = evidence ? {
      ...(submissionId ? { submissionId } : {}),
      version: (existSchedule.revisionHistory?.length ?? 0) + 1,
      reviewedAt: evidence.reviewedAt,
      note: evidence.note,
      changedFields: trackedFields.filter((field) =>
        !sameTrackedValue(field, existSchedule[field], updateData[field])),
    } : undefined;

    const update = revision ? {
        $set: updateData,
        $push: { revisionHistory: revision },
      } : updateData;
    const updated = submissionId
      ? await this.scheduleModel.findOneAndUpdate(
        { _id: id, 'revisionHistory.submissionId': { $ne: submissionId } }, update, { new: true }).exec()
      : await this.scheduleModel.findByIdAndUpdate(id, update, { new: true }).exec();

    if (!updated && submissionId) {
      const published = await this.scheduleModel.findOne({ _id: id, 'revisionHistory.submissionId': submissionId }).exec();
      if (published) return published;
    }

    this.scheduleValidate.throwIfScheduleNotFound(updated); // 혹시 null이면 방지

    return updated;
  }

  // Get schedule by Object Id
  async getScheduleById(id: string): Promise<ScheduleDocument> {
    assertObjectId(id);
    const schedule = await this.scheduleModel.findOne({ _id: id }).exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleNotFound(schedule);

    return schedule;
  }

  // Get schedule list by Date
  async getScheduleListByDate(date: string): Promise<IDateSchedule> {
    assertKstDate(date);
    const startDate = new Date(`${date}T00:00:00+09:00`);
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const scheduleList = await this.scheduleModel
      .find(
        {
          $or: [
            {
              startAt: { $gte: startDate, $lt: endDate },
            },
            { startAt: { $lt: startDate }, endAt: { $gt: startDate } },
          ],
        },
        {
          _id: 1,
          isOfficial: 1,
          title: 1,
          startAt: 1,
          endAt: 1,
          streamerName: 1,
          category: 1,
          fullDay: 1,
          startTimeKnown: 1,
          endTimeKnown: 1,
          status: 1,
        },
      )
      .exec();

    return this.editScheduleListByDate(getDayjs(date), scheduleList);
  }

  // Get schedule list by Date -> Edit schedule data (ScheduleDocument[] => IDateSchedule)
  editScheduleListByDate(
    date: TDayjsType,
    list: ScheduleDocument[],
  ): IDateSchedule {
    const result: IDateSchedule = {};

    list.forEach((item) => {
      const isSame = isSameDate(item.startAt, date);

      const timeKey = isSame && item.startTimeKnown !== false ? dateToFormatString(item.startAt, 'HH') : '미정';

      if (!result[timeKey]) {
        result[timeKey] = [];
      }

      result[timeKey].push(item);
    });

    return result;
  }

  // Get Schedule list by Month
  async getScheduleListByMonth(month: string): Promise<TMonthSchedule> {
    assertKstDate(month);
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(addDate(startDate, 1, 'M'));

    const scheduleList = await this.scheduleModel
      .find(
        {
          $or: [
            { startAt: { $gte: startDate, $lt: endDate } },
            {
              startAt: { $lt: startDate },
              endAt: { $gt: startDate },
            },
          ],
        },
        {
          _id: 1,
          title: 1,
          startAt: 1,
          endAt: 1,
          streamerName: 1,
          category: 1,
          status: 1,
        },
      )
      .exec();

    return this.editScheduleListByMonth(scheduleList, startDate, endDate);
  }

  // Get Schedule list by Month with Object id (스트리머별 month 스케줄)
  async getScheduleListByMonthWithId(
    month: string,
    id: string,
  ): Promise<TMonthSchedule> {
    assertKstDate(month);
    assertObjectId(id);
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(addDate(startDate, 1, 'M'));

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lt: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gt: startDate },
                },
              ],
            },
            { $or: [{ streamerId: new Types.ObjectId(id) }, { memberIds: new Types.ObjectId(id) }] },
          ],
        },
        {
          _id: 1,
          title: 1,
          startAt: 1,
          endAt: 1,
          streamerName: 1,
          category: 1,
          status: 1,
        },
      )
      .exec();

    return this.editScheduleListByMonth(scheduleList, startDate, endDate);
  }

  // Get Schedule list by Month with Streamer Name (스트리머별 month 스케줄)
  async getScheduleListByMonthWithName(
    month: string,
    name: string,
  ): Promise<TMonthSchedule> {
    assertKstDate(month);
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(addDate(startDate, 1, 'M'));

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lt: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gt: startDate },
                },
              ],
            },
            { $or: [{ streamerName: name }, { member: name }] },
          ],
        },
        {
          _id: 1,
          title: 1,
          startAt: 1,
          endAt: 1,
          streamerName: 1,
          category: 1,
          status: 1,
        },
      )
      .exec();

    return this.editScheduleListByMonth(scheduleList, startDate, endDate);
  }

  // Get Chzzk official Schedule list by Month (치지직 공식 스케줄)
  async getOfficialScheduleListByMonth(month: string): Promise<TMonthSchedule> {
    assertKstDate(month);
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(addDate(startDate, 1, 'M'));

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lt: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gt: startDate },
                },
              ],
            },
            { isOfficial: true },
            {
              streamerName: {
                $in: [OfficialName.OFFICIAL, OfficialName.WATCH],
              },
            },
          ],
        },
        {
          _id: 1,
          title: 1,
          startAt: 1,
          endAt: 1,
          streamerName: 1,
          category: 1,
          status: 1,
        },
      )
      .exec();

    return this.editScheduleListByMonth(scheduleList, startDate, endDate);
  }

  // Get Schedule list by Month => Edit Data (ScheduleDocument[] => TMonthSchedule)
  editScheduleListByMonth(
    scheduleList: ScheduleDocument[],
    startDate: Date,
    endDate: Date,
  ): TMonthSchedule {
    const result: TMonthSchedule = {};

    // 해당 월의 시작일과 종료일
    const startLimit = getDayjs(startDate);
    const endLimit = getDayjs(new Date(endDate.getTime() - 1));

    for (const schedule of scheduleList) {
      // 현재 스케줄 시작일과 종료일
      const start = getDayjs(schedule.startAt);
      // An exact midnight end belongs to the preceding day. Unknown ends use
      // the same instant as the start and still belong to the start day.
      const lastIncluded = schedule.endAt.getTime() > schedule.startAt.getTime()
        ? new Date(schedule.endAt.getTime() - 1)
        : schedule.endAt;
      const end = getDayjs(lastIncluded);

      // 기준일 (초기값은 스케줄의 시작일)
      let current = start.clone();

      // 기준일이 스케줄의 종료일과 같을 때까지 반복 (day + 1)
      while (isBeforeDate(current, end) || isSameDate(current, end)) {
        // current가 해당 월의 시작일 이전이면 넘어감
        if (isBeforeDate(current, startLimit)) {
          current = addDate(current, 1, 'd');
          continue;
        }

        // current가 월의 종료일을 넘어가면 while문 종료
        if (isBeforeDate(endLimit, current)) break;

        const dayStr = dateToFormatString(current, 'YYYY-MM-DD');

        // dayStr의 key 값이 처음 등장하면 해당 값 초기화
        if (!result[dayStr]) {
          result[dayStr] = { list: [] };
        }

        // current가 방송 시작일이면 list에 담고 아니라면 preList에 담기
        result[dayStr].list.push(schedule);

        // 다음 날짜로 이동
        current = addDate(current, 1, 'd');
      }

      // 각 날짜별로 list를 startAt 기준으로 정렬
      for (const dayStr in result) {
        result[dayStr].list.sort(
          (a, b) => a.startAt.getTime() - b.startAt.getTime(),
        );
      }
    }

    return result;
  }

  // Get Schedule streamer info by Object id
  async getScheduleLinkById(id: string): Promise<StreamerDocument[]> {
    assertObjectId(id);
    const schedule = await this.scheduleModel.findOne({ _id: id }).exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleNotFound(schedule);

    const result: StreamerDocument[] = [];

    // 메인 스트리머 추가
    const mainStreamer = await this.streamerService.getStreamerByName(
      schedule.streamerName,
    );
    result.push(mainStreamer);

    if (schedule.member) {
      for (const member of schedule.member) {
        try {
          const streamer = await this.streamerService.getStreamerByName(member);
          result.push(streamer);
        } catch {
          continue;
        }
      }
    }

    return result;
  }

  // validate schedule duplicate
  async validateDuplicateSchedule(
    streamerName: string,
    title: string,
    startAt: Date,
    excludeId?: string,
  ) {
    const duplicate = await this.scheduleModel.findOne({
      _id: { $ne: excludeId },
      title,
      startAt,
      $or: [{ streamerName }, { member: streamerName }],
    }).exec();
    this.scheduleValidate.throwIfScheduleExists(duplicate);
  }

  private async resolveMembers(mainName: string, memberNames?: string[]): Promise<StreamerDocument[]> {
    const uniqueNames = [...new Set((memberNames ?? []).filter((name) => name !== mainName))];
    return Promise.all(uniqueNames.map((name) => this.streamerService.getStreamerByName(name)));
  }
}
