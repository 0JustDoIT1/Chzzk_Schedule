import { getScheduleListByDate } from "@/api/schedule-api";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { IDateSchedule } from "@/schemas/schedule.schema";
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
    queryKey: ["getScheduleListByDate", date],
    queryFn: () => getScheduleListByDate(date),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
