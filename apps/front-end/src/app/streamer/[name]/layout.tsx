import { getStreamerByName } from "@/api/streamer-api";
import { queryKeys } from "@/lib/constants/react-query";
import StreamerCommonLayout from "@/lib/screens/layout/streamerLayout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode } from "react";

interface IChzzkLayout {
  children: ReactNode;
  params: Promise<{ name: string }>;
}

export default async function ChzzkLayout({ children, params }: IChzzkLayout) {
  const { name } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getStreamerByName(name),
    queryFn: () => getStreamerByName(name),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StreamerCommonLayout name={name}>{children}</StreamerCommonLayout>;
    </HydrationBoundary>
  );
}
