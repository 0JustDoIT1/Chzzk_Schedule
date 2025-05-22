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
  const res = await fetch(`${baseUrl}${path}`, options);

  if (!res.ok) {
    return res.json().then((error) => error);
  }

  return res.json();
};
