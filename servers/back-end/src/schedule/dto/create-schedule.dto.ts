import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from 'src/lib/constants/schedule-category';

export class CreateScheduleDto {
  @ApiProperty({ description: '치지직 공식 방송 여부' })
  @IsNotEmpty()
  @IsBoolean()
  readonly isOfficial: boolean;

  @ApiProperty({ description: '스트리머 닉네임', required: false })
  @IsOptional()
  @IsString()
  readonly streamer: string;

  @ApiProperty({
    description: '방송 유형',
    enum: Category,
  })
  @IsNotEmpty()
  @IsEnum(Category)
  readonly category: Category;

  @ApiProperty({ description: '방송 제목' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ description: '방송 멤버', required: false })
  @IsOptional()
  @IsArray()
  readonly member: string[];

  @ApiProperty({ description: '방송 시작 일시' })
  @IsNotEmpty()
  @IsDateString()
  readonly startAt: Date;

  @ApiProperty({ description: '방송 종료 일시' })
  @IsNotEmpty()
  @IsDateString()
  readonly endAt: Date;

  @ApiProperty({ description: '방송 내용', required: false })
  @IsOptional()
  @IsString()
  readonly contents: string;
}
