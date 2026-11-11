import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsObject, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { CreateScheduleDto } from '../schedule/dto/create-schedule.dto';
import { CreateStreamerDto } from '../streamer/dto/create-streamer.dto';

export class StreamerSubmissionDto {
  @ValidateNested()
  @Type(() => CreateStreamerDto)
  streamer: CreateStreamerDto;

  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  sourceUrl: string;
}

export class ScheduleSubmissionDto {
  @ValidateNested()
  @Type(() => CreateScheduleDto)
  schedule: CreateScheduleDto;

  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  sourceUrl: string;

  @IsOptional()
  @IsMongoId()
  targetScheduleId?: string;
}

export class RejectSubmissionDto {
  @IsString()
  @MaxLength(500)
  reason: string;
}

export class ApproveSubmissionDto {
  @IsObject()
  payload: Record<string, unknown>;

  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  sourceUrl: string;

  @IsBoolean()
  officialConfirmed: boolean;
}
