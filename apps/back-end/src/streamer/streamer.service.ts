import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Streamer, StreamerDocument } from 'src/schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { UserValidate } from './user.validate';
import { channelIdFromChzzkLink } from './channel-id';

@Injectable()
export class StreamerService {
  constructor(
    @InjectModel(Streamer.name) private streamerModel: Model<StreamerDocument>,
    private userValidate: UserValidate,
  ) {}

  // Get all streamer list
  async getAllStreamerList(): Promise<StreamerDocument[]> {
    return await this.streamerModel.find().exec();
  }

  // Get one streamer by Object Id
  async getStreamerById(id: string): Promise<StreamerDocument> {
    const streamer = await this.streamerModel.findOne({ _id: id }).exec();
    // Validate streamer
    this.userValidate.throwIfUserNotFound(streamer);

    return streamer;
  }

  // Get one streamer by name
  async getStreamerByName(name: string): Promise<StreamerDocument> {
    const streamer = await this.streamerModel.findOne({ name: name }).exec();
    // Validate streamer
    this.userValidate.throwIfUserNotFound(streamer);

    return streamer;
  }

  // Create Streamer
  async create(streamerData: CreateStreamerDto, submissionId?: Types.ObjectId): Promise<StreamerDocument> {
    if (submissionId) {
      const published = await this.streamerModel.findOne({ publicationSubmissionId: submissionId }).exec();
      if (published) return published;
    }
    const channelId = channelIdFromChzzkLink(streamerData.chzzkLink);
    const existStreamer = await this.streamerModel
      .findOne({
        $or: [
          { name: streamerData.name },
          { chzzkLink: streamerData.chzzkLink },
          ...(channelId ? [{ channelId }] : []),
        ],
      })
      .exec();
    if (submissionId && existStreamer?.publicationSubmissionId?.equals(submissionId)) return existStreamer;
    // Validate streamer
    this.userValidate.throwIfUserExists(existStreamer);

    try {
      return await this.streamerModel.create({ ...streamerData, ...(channelId ? { channelId } : {}),
        ...(submissionId ? { publicationSubmissionId: submissionId } : {}) });
    } catch (error) {
      if (submissionId && (error as { code?: number }).code === 11000) {
        const published = await this.streamerModel.findOne({ publicationSubmissionId: submissionId }).exec();
        if (published) return published;
      }
      throw error;
    }
  }
}
