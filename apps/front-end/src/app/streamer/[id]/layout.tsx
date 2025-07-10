import { getStreamerById } from "@/api/streamer-api";
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
  params: { id: string };
}

export default async function ChzzkLayout({ children, params }: IChzzkLayout) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getStreamerById(id),
    queryFn: () => getStreamerById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StreamerCommonLayout id={id}>{children}</StreamerCommonLayout>;
    </HydrationBoundary>
  );
}
