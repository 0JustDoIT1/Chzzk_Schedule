import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AdminWriteGuard } from '../lib/guards/admin-write.guard';
import { ScheduleSubmissionDto, StreamerSubmissionDto, RejectSubmissionDto, ApproveSubmissionDto } from './submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Post('streamer')
  submitStreamer(@Body() input: StreamerSubmissionDto, @Req() request: Request) {
    return this.service.submitStreamer(input, request.ip || request.socket.remoteAddress || 'unknown');
  }

  @Post('schedule')
  submitSchedule(@Body() input: ScheduleSubmissionDto, @Req() request: Request) {
    return this.service.submitSchedule(input, request.ip || request.socket.remoteAddress || 'unknown');
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
  approve(@Param('id') id: string, @Body() input: ApproveSubmissionDto, @Req() request: Request & { adminActor?: string }) {
    return this.service.approve(id, input, request.adminActor);
  }

  @Patch(':id/reject')
  @UseGuards(AdminWriteGuard)
  reject(@Param('id') id: string, @Body() input: RejectSubmissionDto, @Req() request: Request & { adminActor?: string }) {
    return this.service.reject(id, input.reason, request.adminActor);
  }
}
