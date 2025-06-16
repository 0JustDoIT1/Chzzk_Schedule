import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StreamerService } from './streamer.service';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { Streamer } from 'src/schemas/streamer.schema';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Streamer')
@Controller(ApiPath.STREAMER)
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @ApiOperation({ summary: '스트리머 추가 API' })
  @Post(ApiPath.STREAMER_ADD)
  @ApiBody({ description: '스트리머 데이터', type: CreateStreamerDto })
  async create(@Body() streamerData: CreateStreamerDto): Promise<Streamer> {
    return await this.streamerService.create(streamerData);
  }

  @ApiOperation({ summary: '전체 스트리머 리스트 반환 API' })
  @Get(ApiPath.STREAMER_ALL)
  async getAllStreamerList(): Promise<Streamer[]> {
    return await this.streamerService.getAllStreamerList();
  }

  @ApiOperation({ summary: 'Object Id에 해당하는 스트리머 반환 API' })
  @Get(ApiPath.STREAMER_BY_ID)
  async getStreamerById(@Param('id') id: string): Promise<Streamer | null> {
    return await this.streamerService.getStreamerById(id);
  }

  @ApiOperation({ summary: 'name에 해당하는 스트리머 반환 API' })
  @Get(ApiPath.STREAMER_BY_NAME)
  async getStreamerByName(
    @Param('name') name: string,
  ): Promise<Streamer | null> {
    return await this.streamerService.getStreamerByName(name);
  }
}
