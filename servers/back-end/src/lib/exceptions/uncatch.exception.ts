import { HttpStatus } from '@nestjs/common';
import { BaseException } from '.';
import { ErrorCode } from './error';

export class UnCatchedException extends BaseException {
  constructor() {
    super(ErrorCode.UNCATCHED_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
