import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
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

  @ApiProperty({ description: '치지직 채널 주소' })
  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true })
  @Matches(/^https:\/\/chzzk\.naver\.com\/[a-f0-9]{32}\/?$/i)
  readonly chzzkLink: string;

  @ApiProperty({
    description: '태그',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tag: string[];
}
