import { ErrorCode } from './error-code';

export const ErrorMessage: Record<ErrorCode, string> = {
  // 유저 관련 에러 코드
  [ErrorCode.NOT_FOUND]: 'User Not Found',
  [ErrorCode.ALREADY_EXIST]: 'User Already Exist',
  [ErrorCode.NOT_AUTHENTICATED]: 'User Not Authenticated',

  // 검증 관련 에러 코드
  [ErrorCode.VALIDATION_ERROR]: 'Validation Error',

  // request 관련 에러 코드
  [ErrorCode.BAD_REQUEST]: 'Bad Request',
  [ErrorCode.INVALID_PARAM]: 'Invalid Param',
  [ErrorCode.INVALID_QUERY]: 'Invalid Query',

  // 서버 관련 에러 코드
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ErrorCode.INVALID_API]: 'Invalid Api',
  [ErrorCode.UNCATCHED_ERROR]: 'Uncatched Error',
};
