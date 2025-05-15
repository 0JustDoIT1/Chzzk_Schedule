export const enum ErrorCode {
  // 유저 관련 에러 코드
  USER_NOT_FOUND = '1000',
  USER_ALREADY_EXIST = '1001',
  USER_NOT_AUTHENTICATED = '1002',

  // 검증 관련 에러 코드
  VALIDATION_ERROR = '2000',

  // request 관련 에러 코드
  INVALID_PARAM = '3000',
  INVALID_QUERY = '3001',

  // 서버 관련 에러 코드
  INTERNAL_SERVER_ERROR = '9000',
  INVALID_API = '9001',
  UNCATCHED_ERROR = '9999',
}
