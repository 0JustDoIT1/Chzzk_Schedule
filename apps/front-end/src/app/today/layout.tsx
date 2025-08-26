import { getScheduleListByDate } from "@/api/schedule-api";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { queryKeys } from "@/lib/constants/react-query";
import { IDateSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `오늘의 스케줄`,
  description: `오늘의 치지직 방송 스케줄을 확인해보세요.`,
  openGraph: {
    title: `오늘의 스케줄`,
    description: `오늘의 치지직 방송 스케줄을 확인해보세요.`,
  },
};

export default async function TodayLayout({
  children,
}: React.PropsWithChildren) {
  const today = dateToFormatString(getToday(), "YYYY-MM-DD");
  const date = dateTypeToDate(today);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<IDateSchedule>({
    queryKey: queryKeys.getScheduleListByDate(date),
    queryFn: () => getScheduleListByDate(date),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
