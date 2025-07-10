import { defaultFetch } from "./default-fetch";

export const postFetch = async <TRequest, TResponse>(
  ssr: boolean,
  path: string,
  data: TRequest,
  token?: string
): Promise<TResponse> => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  const baseUrl = ssr
    ? (process.env.API_URL as string)
    : (process.env.NEXT_PUBLIC_API_URL as string);

  return defaultFetch<TResponse>({
    baseUrl,
    path,
    options,
  });
};
