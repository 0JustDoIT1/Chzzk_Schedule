import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { StreamerService } from 'src/streamer/streamer.service';
import { ScheduleValidate } from './schedule.validate';
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
} from 'src/lib/utils/dateFormat';
import { IDateSchedule, TMonthSchedule } from 'src/lib/types/schedule.type';
import { StreamerDocument } from 'src/schemas/streamer.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private streamerService: StreamerService,
    private scheduleValidate: ScheduleValidate,
  ) {}

  // Create schedule
  async create(scheduleData: CreateScheduleDto): Promise<ScheduleDocument> {
    const streamer = await this.streamerService.getStreamerByName(
      scheduleData.streamerName,
    );

    // validate schedule already exist
    await this.validateDuplicateSchedule(
      streamer.name,
      scheduleData.title,
      scheduleData.startAt,
    );

    const createData: Schedule = {
      ...scheduleData,
      streamerId: streamer._id,
      chzzkLink: streamer.chzzkLink,
    };

    // Create schedule
    return await this.scheduleModel.create(createData);
  }

  // Update schedule
  async updateSchedule(
    id: string,
    scheduleData: CreateScheduleDto,
  ): Promise<ScheduleDocument> {
    const existSchedule = await this.scheduleModel.findById(id).exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleNotFound(existSchedule);

    const streamer = await this.streamerService.getStreamerByName(
      scheduleData.streamerName,
    );

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
    };

    const updated = await this.scheduleModel
      .findByIdAndUpdate(id, updateData, {
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

    console.log('!!!', month, id);

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
            { streamerId: new Types.ObjectId(id) },
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

    console.log('data', scheduleList);

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
        const streamer = await this.streamerService.getStreamerByName(member);
        result.push(streamer);
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
    // 스트리머 없을 경우는 getStreamerByName에서 이미 exception 처리
    // 해당 스트리머의 이름과 시작날짜로 겹치는 일정이 존재하는지 확인
    const existByDate = await this.scheduleModel
      .findOne({
        _id: { $ne: excludeId },
        streamer: streamerName,
        startAt: startAt,
      })
      .exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleExists(existByDate);

    // 해당 스케줄 제목으로 이미 스케줄이 존재하는지 확인
    const existByTitle = await this.scheduleModel
      .findOne({
        _id: { $ne: excludeId },
        title: title,
      })
      .exec();
    // Validate schedule
    this.scheduleValidate.throwIfScheduleExists(existByTitle);
  }
}
