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

  // Get all streamer list
  async getAllStreamerList(): Promise<Streamer[]> {
    return await this.streamerModel.find();
  }

  // Get one streamer by Object Id
  async getStreamerById(id: string): Promise<Streamer | null> {
    const streamer = await this.streamerModel.findOne({ _id: id });
    // Validate streamer
    this.userValidate.throwIfUserNotFound(streamer);

    return streamer;
  }

  // Get one streamer by name
  async getStreamerByName(name: string): Promise<Streamer | null> {
    const streamer = await this.streamerModel.findOne({ name: name });
    // Validate streamer
    this.userValidate.throwIfUserNotFound(streamer);

    return streamer;
  }

  // Create Streamer
  async create(streamerData: CreateStreamerDto): Promise<Streamer> {
    const existStreamer = await this.streamerModel.findOne({
      $or: [{ name: streamerData.name }, { chzzkLink: streamerData.chzzkLink }],
    });
    // Validate streamer
    this.userValidate.throwIfUserExists(existStreamer);

    return await this.streamerModel.create(streamerData);
  }
}
