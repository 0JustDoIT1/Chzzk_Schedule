import type { IErrorResponse } from "@/types/error-response";
import axios from "axios";

export const axiosErrorHandle = (error: any): IErrorResponse | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.data;
  }
};
