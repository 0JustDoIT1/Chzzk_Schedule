import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller(ApiPath.SCHEDULE)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(ApiPath.SCHEDULE_ADD)
  async create(@Body() scheduleData: CreateScheduleDto) {
    return await this.scheduleService.create(scheduleData);
  }
}
