export interface IErrorResponse {
  errorCode: string;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
}

export interface IApiError extends Error {
  status?: number;
  errorCode?: string;
}
