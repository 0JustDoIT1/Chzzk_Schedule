import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Streamer, StreamerDocument } from 'src/schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { errorHandler } from 'src/lib/exceptions/error/error-handler';
import { UserValidate } from './user.validate';

@Injectable()
export class StreamerService {
  constructor(
    @InjectModel(Streamer.name) private streamerModel: Model<StreamerDocument>,
    private userValidate: UserValidate,
  ) {}

  async create(streamerData: CreateStreamerDto) {
    try {
      return await this.streamerModel.create(streamerData);
    } catch (error) {
      errorHandler(error);
    }
  }
}
