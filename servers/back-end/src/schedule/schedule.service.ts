import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { StreamerService } from 'src/streamer/streamer.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private streamerService: StreamerService,
  ) {}

  async create(scheduleData: CreateScheduleDto) {
    if (scheduleData.streamer) {
      const streamer = await this.streamerService.getStreamerById(
        scheduleData.streamer,
      );
    }

    // 스트리머 이름을 포함할까?
    // 스트리머

    return await this.scheduleModel.create(scheduleData);
  }
}
