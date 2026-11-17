import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './submission.schema';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { StreamerModule } from '../streamer/streamer.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { SubmissionLimit, SubmissionLimitSchema } from './submission-limit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: SubmissionLimit.name, schema: SubmissionLimitSchema },
    ]),
    StreamerModule,
    ScheduleModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
