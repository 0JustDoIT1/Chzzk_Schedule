import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Streamer, StreamerDocument } from 'src/schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';

@Injectable()
export class StreamerService {
  constructor(
    @InjectModel(Streamer.name) private streamerModel: Model<StreamerDocument>,
  ) {}

  async create(streamerData: CreateStreamerDto) {
    return await this.streamerModel.create(streamerData);
  }
}
