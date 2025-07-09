import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import CalendarView from "@/screens/calendarView";
import { QueryClient } from "@tanstack/react-query";

interface IChzzkCalendarPage {
  searchParams: { date?: string };
}

const ChzzkCalendarPage = async ({ searchParams }: IChzzkCalendarPage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <CalendarView date={targetDate} />;
};

export default ChzzkCalendarPage;
