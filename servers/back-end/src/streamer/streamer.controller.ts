import { Body, Controller, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { CreateStreamerDto } from './dto/create-streamer.dto';

@Controller(ApiPath.STREAMER)
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Post(ApiPath.STREAMER_ADD)
  async create(@Body() streamerData: CreateStreamerDto) {
    return await this.streamerService.create(streamerData);
  }
}
