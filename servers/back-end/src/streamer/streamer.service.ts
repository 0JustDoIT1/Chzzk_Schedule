import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Streamer, StreamerDocument } from 'src/schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { UserValidate } from './user.validate';

@Injectable()
export class StreamerService {
  constructor(
    @InjectModel(Streamer.name) private streamerModel: Model<StreamerDocument>,
    private userValidate: UserValidate,
  ) {}

  async getAllStreamer() {
    return await this.streamerModel.find();
  }

  async getStreamerById(id: string) {
    const streamer = await this.streamerModel.findOne({ _id: id });
    this.userValidate.validateUserExit(streamer, false);

    return streamer;
  }

  async create(streamerData: CreateStreamerDto) {
    const streamer = await this.streamerModel.findOne({
      name: streamerData.name,
    });
    this.userValidate.validateUserExit(streamer, true);

    return await this.streamerModel.create(streamerData);
  }
}
