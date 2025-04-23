import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamerDto } from './create-streamer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStreamerDto extends PartialType(CreateStreamerDto) {
  @ApiProperty({
    description: '검사',
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly check: boolean;
}
