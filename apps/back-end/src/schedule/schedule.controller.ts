import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDocument } from 'src/schemas/schedule.schema';
import { IDateSchedule, TMonthSchedule } from 'src/lib/types/schedule.type';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { StreamerDocument } from 'src/schemas/streamer.schema';
import { ApiPath } from '@shared/constants';

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
  @ApiParam({ name: 'id', description: '스케줄 Object Id' })
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
  @ApiParam({ name: 'id', description: '스케줄 Object Id' })
  @Get(ApiPath.SCHEDULE_BY_ID)
  async getScheduleById(@Param('id') id: string): Promise<ScheduleDocument> {
    return await this.scheduleService.getScheduleById(id);
  }

  @ApiOperation({ summary: 'date에 맞는 스케줄 리스트 반환 API' })
  @ApiParam({ name: 'date', description: '날짜 (YYYY-MM-DD)' })
  @Get(ApiPath.SCHEDULE_BY_DATE)
  async getScheduleListByDate(
    @Param('date') date: string,
  ): Promise<IDateSchedule> {
    return await this.scheduleService.getScheduleListByDate(date);
  }

  @ApiOperation({ summary: 'date에 맞는 월 스케줄 리스트 반환 API' })
  @ApiParam({ name: 'month', description: '날짜 (YYYY-MM-DD)' })
  @Get(ApiPath.SCHEDULE_BY_MONTH)
  async getScheduleListByMonth(
    @Param('month') month: string,
  ): Promise<TMonthSchedule> {
    return await this.scheduleService.getScheduleListByMonth(month);
  }

  @ApiOperation({
    summary: 'date와 Object Id에 맞는 월 스케줄 리스트 반환 API',
  })
  @ApiParam({ name: 'month', description: '날짜 (YYYY-MM-DD)' })
  @ApiParam({ name: 'id', description: '스트리머 Object Id' })
  @Get(ApiPath.SCHEDULE_BY_MONTH_WITH_ID)
  async getScheduleListByMonthWithId(
    @Param('month') month: string,
    @Param('id') id: string,
  ): Promise<TMonthSchedule> {
    return await this.scheduleService.getScheduleListByMonthWithId(month, id);
  }

  @ApiOperation({
    summary: 'date와 Streamer Name에 맞는 월 스케줄 리스트 반환 API',
  })
  @ApiParam({ name: 'month', description: '날짜 (YYYY-MM-DD)' })
  @ApiParam({ name: 'name', description: '스트리머 이름' })
  @Get(ApiPath.SCHEDULE_BY_MONTH_WITH_NAME)
  async getScheduleListByMonthWithName(
    @Param('month') month: string,
    @Param('name') name: string,
  ): Promise<TMonthSchedule> {
    const decodedName = decodeURIComponent(name);

    return await this.scheduleService.getScheduleListByMonthWithName(
      month,
      decodedName,
    );
  }

  @ApiOperation({
    summary: 'date에 맞는 치지직 공식 월 스케줄 리스트 반환 API',
  })
  @ApiParam({ name: 'month', description: '날짜 (YYYY-MM-DD)' })
  @Get(ApiPath.SCHEDULE_OFFICIAL_BY_MONTH)
  async getOfficialScheduleListByMonth(
    @Param('month') month: string,
  ): Promise<TMonthSchedule> {
    return await this.scheduleService.getOfficialScheduleListByMonth(month);
  }

  @ApiOperation({
    summary: '_id에 해당하는 스케줄의 스트리머들 정보 반환 API',
  })
  @ApiParam({ name: 'id', description: '스케줄 Object Id' })
  @Get(ApiPath.SCHEDULE_LINK_BY_ID)
  async getScheduleLinkById(
    @Param('id') id: string,
  ): Promise<StreamerDocument[]> {
    return await this.scheduleService.getScheduleLinkById(id);
  }
}
