import { getScheduleLinkById } from "@/api/schedule-api";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface IChannelPageLayout {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `스트리머 채널 바로가기`,
  description: `해당 스케줄의 스트리머 채널로 바로 이동해보세요.`,
  openGraph: {
    title: `스트리머 채널 바로가기`,
    description: `해당 스케줄의 스트리머 채널로 바로 이동해보세요.`,
  },
};

export default async function ChannelPageLayout({
  children,
  params,
}: IChannelPageLayout) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getScheduleLinkById(id),
    queryFn: () => getScheduleLinkById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
