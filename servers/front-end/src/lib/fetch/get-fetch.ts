import { defaultFetch } from "./default-fetch";

export const getFetch = async <T>(
  ssr: boolean,
  path: string,
  token?: string
): Promise<T> => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const options: RequestInit = {
    method: "GET",
    headers,
  };

  const baseUrl = ssr
    ? (process.env.API_URL as string)
    : (process.env.NEXT_PUBLIC_API_URL as string);

  return defaultFetch<T>({
    baseUrl,
    path,
    options,
  });
};
