import { Injectable } from '@nestjs/common';
import {
  UserAlreadyExistException,
  UserNotFoundException,
} from 'src/lib/exceptions/streamer.exception';
import { StreamerDocument } from 'src/schemas/streamer.schema';

@Injectable()
export class UserValidate {
  // 유저가 존재하면 예외 던짐 (타입 가드 필요 없음)
  throwIfUserExists(user: StreamerDocument | null) {
    if (user) {
      throw UserAlreadyExistException(`이미 추가된 스트리머입니다.`);
    }
  }

  // 유저가 없으면 예외 던지고, 이후에는 StreamerDocument 확정
  throwIfUserNotFound(
    user: StreamerDocument | null,
  ): asserts user is StreamerDocument {
    if (!user) {
      throw UserNotFoundException(`존재하지 않는 스트리머입니다.`);
    }
  }
}
