import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { Streamer } from 'src/schemas/streamer.schema';

@Controller(ApiPath.STREAMER)
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Get()
  async getAllStreamer(): Promise<Streamer[]> {
    return await this.streamerService.getAllStreamer();
  }

  @Get(ApiPath.STREAMER_ID)
  async getStreamerById(@Param('id') id: string): Promise<Streamer | null> {
    return await this.streamerService.getStreamerById(id);
  }

  @Get(ApiPath.STREAMER_NAME)
  async getStreamerByName(
    @Param('name') name: string,
  ): Promise<Streamer | null> {
    return await this.streamerService.getStreamerByName(name);
  }

  @Post(ApiPath.STREAMER_ADD)
  async create(@Body() streamerData: CreateStreamerDto): Promise<Streamer> {
    return await this.streamerService.create(streamerData);
  }
}
