"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하는 것을 피하기 위해
        // staleTime을 0보다 크게 설정하는 것이 좋다.
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server일 경우
    // 매번 새로운 queryClient를 만든다.
    return makeQueryClient();
  } else {
    // Client일 경우
    // queryClient가 존재하지 않을 경우에만 새로운 queryClient를 만든다.
    // React가 새 Client를 만들게 하기 위해 중요하다.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function ReactQueryProviders({ children }: PropsWithChildren) {
  // NOTE: queryClient를 useState를 사용하여 초기화 하면 안된다.
  // suspense boundary가 없을 경우 React의 렌더링이 중단될 수도 있고
  // queryClient 자체를 폐기할 수 도 있다.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
