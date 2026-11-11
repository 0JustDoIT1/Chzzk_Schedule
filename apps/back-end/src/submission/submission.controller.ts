import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminWriteGuard } from '../lib/guards/admin-write.guard';
import { ScheduleSubmissionDto, StreamerSubmissionDto, RejectSubmissionDto, ApproveSubmissionDto } from './submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Post('streamer')
  submitStreamer(@Body() input: StreamerSubmissionDto) {
    return this.service.submitStreamer(input);
  }

  @Post('schedule')
  submitSchedule(@Body() input: ScheduleSubmissionDto) {
    return this.service.submitSchedule(input);
  }

  @Get('pending')
  @UseGuards(AdminWriteGuard)
  listPending() {
    return this.service.listPending();
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.service.getStatus(id);
  }

  @Patch(':id/approve')
  @UseGuards(AdminWriteGuard)
  approve(@Param('id') id: string, @Body() input: ApproveSubmissionDto) {
    return this.service.approve(id, input);
  }

  @Patch(':id/reject')
  @UseGuards(AdminWriteGuard)
  reject(@Param('id') id: string, @Body() input: RejectSubmissionDto) {
    return this.service.reject(id, input.reason);
  }
}
