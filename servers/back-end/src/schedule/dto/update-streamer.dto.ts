import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamerDto } from './create-schedule.dto';

export class UpdateStreamerDto extends PartialType(CreateStreamerDto) {}
