import { Injectable } from '@nestjs/common';
import {
  ScheduleAlreadyExistException,
  ScheduleNotFoundException,
} from 'src/lib/exceptions/schedule.exception';
import { Schedule } from 'src/schemas/schedule.schema';

@Injectable()
export class ScheduleValidate {
  throwIfScheduleExists = (schedule: Schedule | null) => {
    // create : 해당 스트리머가 이미 존재할 경우 exception
    if (schedule) {
      throw ScheduleAlreadyExistException(`이미 추가된 일정입니다.`);
    }
  };

  throwIfScheduleNotFound = (schedule: Schedule | null) => {
    // get : 해당 스트리머가 없을 경우 exception
    if (!schedule) {
      throw ScheduleNotFoundException(`존재하지 않는 일정입니다.`);
    }
  };
}
