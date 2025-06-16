import { Injectable } from '@nestjs/common';
import {
  UserAlreadyExistException,
  UserNotFoundException,
} from 'src/lib/exceptions/streamer.exception';
import { Streamer } from 'src/schemas/streamer.schema';

@Injectable()
export class UserValidate {
  throwIfUserExists = (user: Streamer | null) => {
    // create : 해당 스트리머가 이미 존재할 경우 exception
    if (user) {
      throw UserAlreadyExistException(`이미 추가된 스트리머입니다.`);
    }
  };

  throwIfUserNotFound = (user: Streamer | null) => {
    // get : 해당 스트리머가 없을 경우 exception
    if (!user) {
      throw UserNotFoundException(`존재하지 않는 스트리머입니다.`);
    }
  };
}
