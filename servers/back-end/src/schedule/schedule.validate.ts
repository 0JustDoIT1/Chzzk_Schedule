import { Injectable } from '@nestjs/common';
import {
  ScheduleAlreadyExistException,
  ScheduleNotFoundException,
} from 'src/lib/exceptions/schedule.exception';
import { ScheduleDocument } from 'src/schemas/schedule.schema';

@Injectable()
export class ScheduleValidate {
  // 스케줄이 존재하면 예외 던짐 (타입 가드 필요 없음)
  throwIfScheduleExists(schedule: ScheduleDocument | null) {
    if (schedule) {
      throw ScheduleAlreadyExistException(`이미 추가된 일정입니다.`);
    }
  }

  // 스케줄이 없으면 예외 던지고, 이후에는 ScheduleDocument로 확정
  throwIfScheduleNotFound(
    schedule: ScheduleDocument | null,
  ): asserts schedule is ScheduleDocument {
    if (!schedule) {
      throw ScheduleNotFoundException(`존재하지 않는 일정입니다.`);
    }
  }
}
