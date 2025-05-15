import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/lib/exceptions/streamer.exception';

@Injectable()
export class UserValidate {
  public validateUser = (name: string, user: string) => {
    if (!user) {
      throw UserNotFoundException(`${name}을(를) 찾을 수 없습니다.`);
    }
  };
}
