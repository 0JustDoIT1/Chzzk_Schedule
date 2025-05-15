import { HttpStatus } from '@nestjs/common';
import { BaseException } from '.';
import { ErrorCode } from './error';

export class InternalServerException extends BaseException {
  constructor() {
    super(ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
