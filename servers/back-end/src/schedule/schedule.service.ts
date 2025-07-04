import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { IDateSchedule, IMonthSchedule } from 'src/lib/types/schedule.type';

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

  // Get schedule list by Date -> Edit schedule data
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

  async getScheduleListByMonth(month: string): Promise<IMonthSchedule> {
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

  editScheduleListByMonth(
    scheduleList: ScheduleDocument[],
    startDate: Date,
    endDate: Date,
  ): IMonthSchedule {
    const resultMap = new Map<
      string,
      { preList: ScheduleDocument[]; list: ScheduleDocument[] }
    >();

    for (const schedule of scheduleList) {
      // 현재 스케줄 시작일과 종료일
      const start = getDayjs(schedule.startAt);
      const end = getDayjs(schedule.endAt);
      // 해당 월의 시작일과 종료일
      const startLimit = getDayjs(startDate);
      const endLimit = getDayjs(endDate);

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
        if (!resultMap.has(dayStr)) {
          resultMap.set(dayStr, { list: [], preList: [] });
        }

        // current가 방송 시작일과 같은지 체크 (list, preList 구분하기 위해서)
        const isStartDay = isSameDate(current, start);
        // dayStr을 키값으로 가져옴
        const group = resultMap.get(dayStr)!;

        // current가 방송 시작일이면 list에 담고 아니라면 preList에 담기
        if (isStartDay) group.list.push(schedule);
        else group.preList.push(schedule);

        // 다음 날짜로 이동
        current = addDate(current, 1, 'd');
      }
    }

    // 현재 생성한 resultMap은 map이기 때문에 day를 기준으로 원하는 형태의 array로 변경
    const result: IMonthSchedule = Array.from(resultMap.entries())
      .map(([day, value]) => ({
        day,
        preList: value.preList,
        list: value.list,
      }))
      // day가 ISO string 형태기 때문에 날짜문자열 sort 가능
      .sort((a, b) => a.day.localeCompare(b.day));

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
