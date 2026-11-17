import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import CalendarView from "@/lib/screens/calendarView";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IAllCalendarPage {
  searchParams: Promise<{ date?: string }>;
}

const AllCalendarPage = async ({ searchParams }: IAllCalendarPage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}><CalendarView date={targetDate} /></HydrationBoundary>;
};

export default AllCalendarPage;
