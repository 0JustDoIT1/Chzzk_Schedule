import { UserAlreadyExistException } from 'src/lib/exceptions/streamer.exception';
import { InternalServerException } from '../internal-server.exception';

export const errorHandler = (error: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // Unique constraint violation
    throw UserAlreadyExistException('이미 존재하는 스트리머입니다.'); // The message defined in the plugin
  }
  throw InternalServerException; // Other errors
};
