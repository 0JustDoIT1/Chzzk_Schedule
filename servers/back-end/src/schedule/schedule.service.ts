import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { errorHandler } from 'src/lib/exceptions/error/error-handler';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(scheduleData: CreateScheduleDto) {
    try {
      console.log('###', scheduleData);
      await this.scheduleModel.create(scheduleData);
    } catch (error) {
      errorHandler(error);
    }
  }
}
