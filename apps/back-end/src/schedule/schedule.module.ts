import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from 'src/schemas/schedule.schema';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { StreamerModule } from 'src/streamer/streamer.module';
import { ScheduleValidate } from './schedule.validate';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    StreamerModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleValidate],
})
export class ScheduleModule {}
