import { defaultFetch } from "./default-fetch";

export const postFetch = async <T>(
  ssr: boolean,
  path: string,
  data: T,
  token?: string
): Promise<T> => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
