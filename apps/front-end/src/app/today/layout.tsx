import { getScheduleListByDate } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import { IDateSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
