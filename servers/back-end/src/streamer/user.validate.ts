import { Injectable } from '@nestjs/common';
import {
  UserAlreadyExistException,
  UserNotFoundException,
} from 'src/lib/exceptions/streamer.exception';
import { Streamer } from 'src/schemas/streamer.schema';

@Injectable()
export class UserValidate {
  public validateUserExit = (user: Streamer | null, create: boolean) => {
    if (!create && !user) {
      throw UserNotFoundException(`추가되지 않은 스트리머입니다.`);
    }

    if (create && user) {
      throw UserAlreadyExistException(`이미 추가된 스트리머입니다.`);
    }

    return user;
  };
}
