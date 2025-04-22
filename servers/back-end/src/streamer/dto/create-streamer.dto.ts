import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateStreamerDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly chzzkLink: string;

  @IsString()
  @IsOptional()
  readonly mcn?: string;

  @IsArray()
  @IsOptional()
  readonly tag: string[];
}
