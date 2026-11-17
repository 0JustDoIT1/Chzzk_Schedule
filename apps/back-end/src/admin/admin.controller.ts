import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import type { Request } from 'express';
import { AdminWriteGuard } from '../lib/guards/admin-write.guard';
import { AdminService } from './admin.service';

class LoginDto {
  @IsString()
  @MaxLength(100)
  username: string;

  @IsString()
  @MaxLength(200)
  password: string;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  login(@Body() input: LoginDto, @Req() request: Request) {
    return this.service.login(input.username, input.password, request.ip || request.socket.remoteAddress || 'unknown');
  }

  @Get('session')
  @UseGuards(AdminWriteGuard)
  session() {
    return { valid: true };
  }
}
