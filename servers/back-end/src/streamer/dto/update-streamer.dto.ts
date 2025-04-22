import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamerDto } from './create-streamer.dto';

export class UpdateStreamerDto extends PartialType(CreateStreamerDto) {}
