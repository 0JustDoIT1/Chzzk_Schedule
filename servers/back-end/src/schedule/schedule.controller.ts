import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDocument } from 'src/schemas/schedule.schema';
import { IDateSchedule, TMonthSchedule } from 'src/lib/types/schedule.type';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StreamerDocument } from 'src/schemas/streamer.schema';

@ApiTags('Schedule')
@Controller(ApiPath.SCHEDULE)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: '스케줄 추가 API' })
  @Post(ApiPath.SCHEDULE_ADD)
  @ApiBody({ description: '스케줄 데이터', type: CreateScheduleDto })
  async create(
    @Body() scheduleData: CreateScheduleDto,
  ): Promise<ScheduleDocument> {
    return await this.scheduleService.create(scheduleData);
  }

  @ApiOperation({ summary: '_id에 해당하는 스케줄 수정 API' })
  @ApiParam({ name: 'id', description: 'Schedule ObjectId' })
  // 전체 데이터를 항상 받아오기 때문에 create dto 사용
  @ApiBody({ description: '수정할 스케줄 데이터', type: CreateScheduleDto })
  @Patch(ApiPath.SCHEDULE_UPDATE)
  async updateSchedule(
    @Param('id') id: string,
    @Body() scheduleData: CreateScheduleDto,
  ): Promise<ScheduleDocument> {
    return await this.scheduleService.updateSchedule(id, scheduleData);
  }

  @ApiOperation({ summary: '_id에 해당하는 스케줄 반환 API' })
  @ApiParam({ name: 'id', description: 'Schedule ObjectId' })
  @Get(ApiPath.SCHEDULE_BY_ID)
  async getScheduleById(@Param('id') id: string): Promise<ScheduleDocument> {
    return await this.scheduleService.getScheduleById(id);
  }

  @ApiOperation({ summary: 'date에 맞는 스케줄 리스트 반환 API' })
  @Get(ApiPath.SCHEDULE_BY_DATE)
  async getScheduleListByDate(
    @Param('date') date: string,
  ): Promise<IDateSchedule> {
    return await this.scheduleService.getScheduleListByDate(date);
  }

  @ApiOperation({
    summary: '_id에 해당하는 스케줄의 스트리머들 정보 반환 API',
  })
  @ApiParam({ name: 'id', description: 'Schedule ObjectId' })
  async getScheduleLinkById(
    @Param('id') id: string,
  ): Promise<StreamerDocument> {
    return await this.scheduleService.getScheduleLinkById(id);
  }
}
