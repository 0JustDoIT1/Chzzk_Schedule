import { defaultFetch } from "./default-fetch";

export const getFetch = async <T>(
  ssr: boolean,
  path: string,
  token?: string
): Promise<T> => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const headers = new Headers(options.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  return defaultFetch<T>({
    baseUrl: ssr
      ? (process.env.API_URL as string)
      : (process.env.NEXT_PUBLIC_API_URL as string),
    path: path,
    options: options,
  });
};
