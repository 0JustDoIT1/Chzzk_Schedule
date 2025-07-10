import { IErrorResponse } from "../types/error-response";

interface IDefaultFetch {
  baseUrl: string;
  path: string;
  options?: RequestInit;
}

export const defaultFetch = async <T>({
  baseUrl,
  path,
  options,
}: IDefaultFetch): Promise<T> => {
  const res = await fetch(`${baseUrl}/${path}`, options);

  if (!res.ok) {
    const errorData: IErrorResponse = await res.json();
    // throw new Error(errorData.message || "서버 오류가 발생했습니다.");

    const error = new Error(errorData.message);
    (error as any).status = res.status;
    (error as any).errorCode = errorData.errorCode;

    throw error;
  }

  return res.json();
};
