import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsMongoId, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateScheduleDto } from '../schedule/dto/create-schedule.dto';
import { CreateStreamerDto } from '../streamer/dto/create-streamer.dto';
import { RejectionCode, rejectionCodes } from './submission.schema';

export class StreamerSubmissionDto {
  @ValidateNested()
  @Type(() => CreateStreamerDto)
  streamer: CreateStreamerDto;

}

export class ScheduleSubmissionDto {
  @ValidateNested()
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto;


  @IsOptional()
  @IsMongoId()
  targetScheduleId?: string;
}

export class RejectSubmissionDto {
  @IsIn(rejectionCodes)
  rejectionCode: RejectionCode;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class ApproveSubmissionDto {
  @IsObject()
  payload: Record<string, unknown>;


  @IsBoolean()
  officialConfirmed: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  changeNote?: string;
}
