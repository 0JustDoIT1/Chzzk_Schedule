import { Injectable } from '@nestjs/common';
import {
  UserAlreadyExistException,
  UserNotFoundException,
} from 'src/lib/exceptions/streamer.exception';
import { Streamer } from 'src/schemas/streamer.schema';

@Injectable()
export class UserValidate {
  public validateUserExit = (user: Streamer | null, create: boolean) => {
    // get : 해당 스트리머가 없을 경우 exception
    if (!create && !user) {
      throw UserNotFoundException(`존재하지 않는 스트리머입니다.`);
    }

    // create : 해당 스트리머가 이미 존재할 경우 exception
    if (create && user) {
      throw UserAlreadyExistException(`이미 추가된 스트리머입니다.`);
    }

    return user;
  };
}
