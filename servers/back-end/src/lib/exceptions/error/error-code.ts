export const enum ErrorCode {
  // 데이터 관련 에러 코드
  NOT_FOUND = '1000',
  ALREADY_EXIST = '1001',
  NOT_AUTHENTICATED = '1002',

  // 검증 관련 에러 코드
  VALIDATION_ERROR = '2000',

  // request 관련 에러 코드
  BAD_REQUEST = '3000',
  INVALID_PARAM = '3001',
  INVALID_QUERY = '3002',

  // 서버 관련 에러 코드
  INTERNAL_SERVER_ERROR = '9000',
  INVALID_API = '9001',
  UNCATCHED_ERROR = '9999',
}
