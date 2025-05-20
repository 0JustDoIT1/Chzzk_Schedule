import type { IErrorResponse } from "@/types/error-response";
import { TToastType } from "@/types/toastType";
import axios from "axios";

const axiosErrorHandle = (error: any): IErrorResponse | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.data;
  }
};

export const showErrorToast = (
  error: any,
  showToast: (type: TToastType, message: string) => void
) => {
  const axiosError = axiosErrorHandle(error) as IErrorResponse;
  showToast("error", axiosError?.message);
};
