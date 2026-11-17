import { getScheduleListByMonthWithName } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import CalendarView from "@/lib/screens/calendarView";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IStreamerCalendarPage {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ date?: string }>;
}

const StreamerCalendarPage = async ({
  params,
  searchParams,
}: IStreamerCalendarPage) => {
  const { name } = await params;
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonthWithName(targetDate, name),
    queryFn: () => getScheduleListByMonthWithName(targetDate, name),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}><CalendarView date={targetDate} name={name} /></HydrationBoundary>;
};

export default StreamerCalendarPage;
