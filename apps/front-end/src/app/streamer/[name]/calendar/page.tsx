import { getScheduleListByMonthWithName } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import CalendarView from "@/lib/screens/calendarView";
import { QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IStreamerCalendarPage {
  params: Promise<{ name: string }>;
  searchParams: { date?: string };
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

  return <CalendarView date={targetDate} name={name} />;
};

export default StreamerCalendarPage;
