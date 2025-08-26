import { getScheduleById } from "@/api/schedule-api";
import { getAllStreamerList } from "@/api/streamer-api";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface IScheduleEditLayout {
  children: React.ReactNode;
  params: { schedule: string };
}

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `스케줄 수정`,
  description: `해당 스케줄을 수정해보세요.`,
  openGraph: {
    title: `스케줄 수정`,
    description: `해당 스케줄을 수정해보세요.`,
  },
};

export default async function ScheduleEditLayout({
  children,
  params,
}: IScheduleEditLayout) {
  const { schedule } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getScheduleById(schedule),
    queryFn: () => getScheduleById(schedule),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
