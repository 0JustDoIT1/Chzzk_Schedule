import type { IErrorResponse } from "@/types/error-response";

export const isResError = (
  res: IErrorResponse | any
): res is IErrorResponse => {
  if (!res) return true;
  return (res as IErrorResponse).errorCode !== undefined;
};
