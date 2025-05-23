import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from 'src/schemas/schedule.schema';
import { IDateSchedule } from 'src/lib/types/schedule.type';

@Controller(ApiPath.SCHEDULE)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(ApiPath.SCHEDULE_ADD)
  async create(@Body() scheduleData: CreateScheduleDto): Promise<Schedule> {
    console.log('테스트', scheduleData);
    return await this.scheduleService.create(scheduleData);
  }

  @Get(ApiPath.SCHEDULE_BY_DATE)
  async getScheduleListByDate(
    @Param('date') date: string,
  ): Promise<IDateSchedule> {
    return await this.scheduleService.getScheduleListByDate(date);
  }
}
