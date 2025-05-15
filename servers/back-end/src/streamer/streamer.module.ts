import { Module } from '@nestjs/common';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Streamer, StreamerSchema } from 'src/schemas/streamer.schema';
import { UserValidate } from './user.validate';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Streamer.name, schema: StreamerSchema },
    ]),
  ],
  controllers: [StreamerController],
  providers: [StreamerService, UserValidate],
})
export class StreamerModule {}
