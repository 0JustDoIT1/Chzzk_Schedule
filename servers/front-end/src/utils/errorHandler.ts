import type { IErrorResponse } from "@/types/error-response";
import axios from "axios";

export const axiosError = (error: any): IErrorResponse | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.data;
  }
};

export const isResError = (
  res: IErrorResponse | any
): res is IErrorResponse => {
  if (!res) return true;
  return (res as IErrorResponse).errorCode !== undefined;
};
