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
  getToday,
  isSameDate,
} from 'src/lib/utils/dateFormat';
import { IDateSchedule } from 'src/lib/types/schedule.type';

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

  // // Get schedule list by streamer Object Id
  // async getAllScheduleByStreamerId(id: string): Promise<Schedule[] | null> {
  //   return await this.scheduleModel.find({
  //     streamerId: id,
  //   }).exec();
  // }

  // Get schedule list by Date
  async getScheduleListByDate(date: string): Promise<IDateSchedule> {
    const date1 = dateTypeToDate(date);
    const date2 = dateTypeToDate(addDate(date, 1, 'day'));

    const scheduleList = await this.scheduleModel
      .find(
        {
          $or: [
            {
              startAt: { $gte: date1, $lt: date2 },
            },
            { startAt: { $lt: date1 }, endAt: { $gt: date1 } },
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

    return this.editDateScheduleList(scheduleList);
  }

  editDateScheduleList(list: ScheduleDocument[]): IDateSchedule {
    const result = {};

    list.forEach((item) => {
      const dateCheck = isSameDate(item.startAt, getToday());

      const time = dateCheck ? dateToFormatString(item.startAt, 'HH') : '미정';
      result[time] = result[time] ? [...result[time], item] : [item];
    });

    return result;
  }

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
