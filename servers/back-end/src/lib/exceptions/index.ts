import { ErrorCode, ErrorMessage } from './error';

export class BaseException extends Error {
  readonly errorCode: ErrorCode;
  readonly statusCode: number;

  constructor(errorCode: ErrorCode, statusCode: number, message?: string) {
    message = message ? message : ErrorMessage[errorCode];

    super(message);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
