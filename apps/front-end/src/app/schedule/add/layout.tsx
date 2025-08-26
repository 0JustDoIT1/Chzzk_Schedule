import { getAllStreamerList } from "@/api/streamer-api";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `일정 추가`,
  description: `원하는 스트리머의 일정을 추가해보세요.`,
  openGraph: {
    title: `일정 추가`,
    description: `원하는 스트리머의 일정을 추가해보세요.`,
  },
};

export default async function ScheduleAddLayout({
  children,
}: React.PropsWithChildren) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
