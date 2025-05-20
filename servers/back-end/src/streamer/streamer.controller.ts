import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { CreateStreamerDto } from './dto/create-streamer.dto';

@Controller(ApiPath.STREAMER)
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Get()
  async getAllStreamer() {
    return await this.streamerService.getAllStreamer();
  }

  @Get(ApiPath.STREAMER_ID)
  async getStreamerById(@Param('id') id: string) {
    return await this.streamerService.getStreamerById(id);
  }

  @Post(ApiPath.STREAMER_ADD)
  async create(@Body() streamerData: CreateStreamerDto) {
    return await this.streamerService.create(streamerData);
  }
}
