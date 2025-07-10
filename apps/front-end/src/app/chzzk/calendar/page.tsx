import { getOfficialScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import CalendarView from "@/lib/screens/calendarView";
import { QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IChzzkCalendarPage {
  searchParams: { date?: string };
}

const ChzzkCalendarPage = async ({ searchParams }: IChzzkCalendarPage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getOfficialScheduleListByMonth(targetDate),
    queryFn: () => getOfficialScheduleListByMonth(targetDate),
  });

  return <CalendarView date={targetDate} isOfficial={true} />;
};

export default ChzzkCalendarPage;
