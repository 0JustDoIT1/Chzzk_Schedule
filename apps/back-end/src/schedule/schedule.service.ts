import { ConflictException, Injectable } from '@nestjs/common';
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
  getEndDate,
  getStartDate,
  getToday,
  isBeforeDate,
  isSameDate,
  TDayjsType,
} from '@shared/utils';
import { OfficialName } from '@shared/constants';

export interface PublicationEvidence {
  sourceUrl: string;
  note: string;
  reviewedAt: Date;
}

const trackedFields = [
  'isOfficial', 'streamerName', 'category', 'title', 'member',
  'fullDay', 'startAt', 'endAt', 'contents',
] as const;

const sameTrackedValue = (field: typeof trackedFields[number], before: unknown, after: unknown) => {
  if (field === 'startAt' || field === 'endAt') {
    return new Date(before as string | Date).getTime() === new Date(after as string | Date).getTime();
  }
  return JSON.stringify(before) === JSON.stringify(after);
};

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private streamerService: StreamerService,
    private scheduleValidate: ScheduleValidate,
  ) {}

  async create(scheduleData: CreateScheduleDto, evidence?: PublicationEvidence): Promise<ScheduleDocument> {
    const streamer = await this.streamerService.getStreamerByName(scheduleData.streamerName);
    const members = await this.resolveMembers(streamer.name, scheduleData.member);
    await this.validateDuplicateSchedule(streamer.name, scheduleData.title, scheduleData.startAt);

    const createData: Schedule = {
      ...scheduleData,
      streamerId: streamer._id,
      chzzkLink: streamer.chzzkLink,
      member: members.map((member) => member.name),
      memberIds: members.map((member) => member._id),
      ...(evidence ? {
        sourceUrl: evidence.sourceUrl,
        revisionHistory: [{ version: 1, sourceUrl: evidence.sourceUrl, reviewedAt: evidence.reviewedAt, note: evidence.note, changedFields: [] }],
      } : {}),
    };
    return this.scheduleModel.create(createData);
  }

  // Update schedule
  async updateSchedule(
    id: string,
    scheduleData: CreateScheduleDto,
    evidence?: PublicationEvidence,
  ): Promise<ScheduleDocument> {
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
    };

    const revision: ScheduleRevision | undefined = evidence ? {
      version: (existSchedule.revisionHistory?.length ?? 0) + 1,
      sourceUrl: evidence.sourceUrl,
      reviewedAt: evidence.reviewedAt,
      note: evidence.note,
      changedFields: trackedFields.filter((field) =>
        !sameTrackedValue(field, existSchedule[field], updateData[field])),
    } : undefined;

    const updated = await this.scheduleModel
      .findByIdAndUpdate(id, revision ? {
        $set: { ...updateData, sourceUrl: evidence!.sourceUrl },
        $push: { revisionHistory: revision },
      } : updateData, {
        new: true,
      })
      .exec();

    this.scheduleValidate.throwIfScheduleNotFound(updated); // 혹시 null이면 방지

    return updated;
  }

  // Get schedule by Object Id
  async getScheduleById(id: string): Promise<ScheduleDocument> {
    const schedule = await this.scheduleModel.findOne({ _id: id }).exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleNotFound(schedule);

    return schedule;
  }

  // Get schedule list by Date
  async getScheduleListByDate(date: string): Promise<IDateSchedule> {
    const startDate = dateTypeToDate(date);
    const endDate = dateTypeToDate(addDate(date, 1, 'd'));

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
        },
      )
      .exec();

    return this.editScheduleListByDate(getToday(), scheduleList);
  }

  // Get schedule list by Date -> Edit schedule data (ScheduleDocument[] => IDateSchedule)
  editScheduleListByDate(
    date: TDayjsType,
    list: ScheduleDocument[],
  ): IDateSchedule {
    const result: IDateSchedule = {};

    list.forEach((item) => {
      const isSame = isSameDate(item.startAt, date);

      const timeKey = isSame ? dateToFormatString(item.startAt, 'HH') : '미정';

      if (!result[timeKey]) {
        result[timeKey] = [];
      }

      result[timeKey].push(item);
    });

    return result;
  }

  // Get Schedule list by Month
  async getScheduleListByMonth(month: string): Promise<TMonthSchedule> {
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(getEndDate(startDate, 'M')); // e.g. 2025-03-31 23:59

    const scheduleList = await this.scheduleModel
      .find(
        {
          $or: [
            { startAt: { $gte: startDate, $lte: endDate } },
            {
              startAt: { $lt: startDate },
              endAt: { $gte: startDate },
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
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(getEndDate(startDate, 'M')); // e.g. 2025-03-31 23:59

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lte: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gte: startDate },
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
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(getEndDate(startDate, 'M')); // e.g. 2025-03-31 23:59

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lte: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gte: startDate },
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
        },
      )
      .exec();

    return this.editScheduleListByMonth(scheduleList, startDate, endDate);
  }

  // Get Chzzk official Schedule list by Month (치지직 공식 스케줄)
  async getOfficialScheduleListByMonth(month: string): Promise<TMonthSchedule> {
    const startDate = dateTypeToDate(getStartDate(month, 'M')); // e.g. 2025-03-01
    const endDate = dateTypeToDate(getEndDate(startDate, 'M')); // e.g. 2025-03-31 23:59

    const scheduleList = await this.scheduleModel
      .find(
        {
          $and: [
            {
              $or: [
                { startAt: { $gte: startDate, $lte: endDate } },
                {
                  startAt: { $lt: startDate },
                  endAt: { $gte: startDate },
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
    const endLimit = getDayjs(endDate);

    for (const schedule of scheduleList) {
      // 현재 스케줄 시작일과 종료일
      const start = getDayjs(schedule.startAt);
      const end = getDayjs(schedule.endAt);

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
