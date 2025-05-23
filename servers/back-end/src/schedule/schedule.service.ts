import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { StreamerService } from 'src/streamer/streamer.service';
import { ScheduleValidate } from './schedule.validate';
import { Streamer } from 'src/schemas/streamer.schema';
import { AllCategory } from 'src/lib/constants/schedule-category';
import {
  addDate,
  dateToFormatString,
  dateTypeToDate,
  getDateByString,
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
  async create(scheduleData: CreateScheduleDto): Promise<Schedule> {
    // 스트리머 방송 (= 스트리머 field 있을 경우)
    if (!scheduleData.isOfficial) {
      // 스트리머 없을 경우는 getStreamerByName에서 이미 exception 처리
      const streamer = await this.streamerService.getStreamerByName(
        scheduleData.streamer,
      );
      if (streamer) {
        // 해당 스트리머의 이름과 시작날짜로 겹치는 일정이 존재하는지 확인
        const schedule = await this.scheduleModel.findOne({
          streamer: streamer.name,
          startAt: scheduleData.startAt,
        });
        // Validate schedule
        this.scheduleValidate.validateScheduleExit(schedule, true);
      }
    }

    // 해당 스케줄 제목으로 이미 스케줄이 존재하는지 확인
    const schedule = await this.scheduleModel.findOne({
      title: scheduleData.title,
    });
    // Validate schedule
    this.scheduleValidate.validateScheduleExit(schedule, true);

    // Create schedule
    return await this.scheduleModel.create(scheduleData);
  }

  // // Get schedule by Object Id
  // async getScheduleById(id: string): Promise<Schedule | null> {
  //   const schedule = await this.scheduleModel.findOne({ _id: id });
  //   // Validate schedule
  //   this.scheduleValidate.validateScheduleExit(schedule, false);

  //   return schedule;
  // }

  // // Get schedule list by streamer Object Id
  // async getAllScheduleByStreamerId(id: string): Promise<Schedule[] | null> {
  //   return await this.scheduleModel.find({
  //     _id: id,
  //   });
  // }

  // Get schedule list by Date
  async getScheduleListByDate(date: string): Promise<IDateSchedule> {
    const date1 = dateTypeToDate(date);
    const date2 = dateTypeToDate(addDate(date, 1, 'day'));

    const scheduleList = await this.scheduleModel.find({
      startAt: { $gte: date1, $lt: date2 },
    });

    return this.editDateScheduleList(scheduleList);
  }

  editDateScheduleList(list: Schedule[]): IDateSchedule {
    const result = {};
    console.log('!!!', list);

    list.forEach((item) => {
      console.log('!!!', item);
      const time = dateToFormatString(item.startAt, 'HH');
      result[time] = result[time] ? [...result[time], item] : [item];
    });

    return result;
  }
}
