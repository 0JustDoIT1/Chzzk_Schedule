import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/lib/exceptions/streamer.exception';
import { Streamer } from 'src/schemas/streamer.schema';

@Injectable()
export class UserValidate {
  public validateUserExit = (user: Streamer | null) => {
    if (!user) {
      throw UserNotFoundException(`추가되지 않은 스트리머입니다.`);
    }
  };
}
