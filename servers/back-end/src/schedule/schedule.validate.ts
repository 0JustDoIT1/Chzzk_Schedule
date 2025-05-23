import { Injectable } from '@nestjs/common';
import {
  UserAlreadyExistException,
  UserNotFoundException,
} from 'src/lib/exceptions/streamer.exception';
import { Schedule } from 'src/schemas/schedule.schema';
import { Streamer } from 'src/schemas/streamer.schema';

@Injectable()
export class ScheduleValidate {
  public validateScheduleExit = (
    schedule: Schedule | null,
    create: boolean,
  ) => {
    // get : 해당 스케줄이 없을 경우 exception
    if (!create && !schedule) {
      throw UserNotFoundException(`존재하지 않는 스케줄입니다.`);
    }

    // create : 해당 스케줄이 이미 존재할 경우 exception
    if (create && schedule) {
      throw UserAlreadyExistException(`이미 추가된 스케줄입니다.`);
    }

    return schedule;
  };

  public validateScheduleByStreamer = (streamer: Streamer) => {};
}
