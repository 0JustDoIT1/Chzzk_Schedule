import { Module } from '@nestjs/common';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Streamer, StreamerSchema } from 'src/schemas/streamer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Streamer.name, schema: StreamerSchema },
    ]),
  ],
  controllers: [StreamerController],
  providers: [StreamerService],
})
export class StreamerModule {}
