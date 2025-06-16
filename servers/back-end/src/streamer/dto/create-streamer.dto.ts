import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStreamerDto {
  @ApiProperty({ description: '치지직 공식 채널 여부' })
  @IsNotEmpty()
  @IsBoolean()
  readonly isOfficial: boolean;

  @ApiProperty({ description: '스트리머 닉네임' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '치지직 방송 링크' })
  @IsNotEmpty()
  @IsString()
  readonly chzzkLink: string;

  @ApiProperty({
    description: '태그',
    required: false,
  })
  @IsOptional()
  @IsArray()
  readonly tag: string[];
}
