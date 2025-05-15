import { HttpStatus } from '@nestjs/common';
import { BaseException } from '.';
import { ErrorCode } from './error';

export const UserAlreadyExistException = (message?: string): BaseException => {
  return new BaseException(
    ErrorCode.USER_ALREADY_EXIST,
    HttpStatus.INTERNAL_SERVER_ERROR,
    message,
  );
};

export const UserNotFoundException = (message?: string): BaseException => {
  return new BaseException(
    ErrorCode.USER_NOT_FOUND,
    HttpStatus.NOT_FOUND,
    message,
  );
};
