import { HttpStatus } from '@nestjs/common';
import { BaseException } from '.';
import { ErrorCode } from './error';

export const UserAlreadyExistException = (message?: string): BaseException => {
  return new BaseException(
    ErrorCode.ALREADY_EXIST,
    HttpStatus.CONFLICT,
    message,
  );
};

export const UserNotFoundException = (message?: string): BaseException => {
  return new BaseException(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, message);
};
