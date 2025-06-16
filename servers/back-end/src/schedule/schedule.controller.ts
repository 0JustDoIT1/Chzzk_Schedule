import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from 'src/schemas/schedule.schema';
import { IDateSchedule } from 'src/lib/types/schedule.type';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Schedule')
@Controller(ApiPath.SCHEDULE)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: '스케줄 추가 API' })
  @Post(ApiPath.SCHEDULE_ADD)
  @ApiBody({ description: '스케줄 데이터', type: CreateScheduleDto })
  async create(@Body() scheduleData: CreateScheduleDto): Promise<Schedule> {
    console.log('테스트', scheduleData);
    return await this.scheduleService.create(scheduleData);
  }

  @ApiOperation({ summary: '_id에 해당하는 스케줄 반환 API' })
  @Get(ApiPath.SCHEDULE_BY_ID)
  async getScheduleById(@Param('id') id: string): Promise<Schedule | null> {
    return await this.scheduleService.getScheduleById(id);
  }

  @ApiOperation({ summary: 'date에 맞는 스케줄 리스트 반환 API' })
  @Get(ApiPath.SCHEDULE_BY_DATE)
  async getScheduleListByDate(
    @Param('date') date: string,
  ): Promise<IDateSchedule> {
    return await this.scheduleService.getScheduleListByDate(date);
  }
}
