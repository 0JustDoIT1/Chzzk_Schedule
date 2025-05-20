import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StreamerModule } from './streamer/streamer.module';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      dbName: process.env.DB_Name,
    }),
    StreamerModule,
    ScheduleModule,
  ],
  controllers: [AppController, ScheduleController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
