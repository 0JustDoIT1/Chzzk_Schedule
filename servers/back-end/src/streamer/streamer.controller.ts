import { Body, Controller, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { CreateStreamerDto } from './dto/create-streamer.dto';

@Controller('streamer')
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Post()
  async create(@Body() streamerData: CreateStreamerDto) {
    return await this.streamerService.create(streamerData);
  }
}
