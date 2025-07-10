import { getScheduleListByMonthWithId } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import CalendarView from "@/screens/calendarView";
import { QueryClient } from "@tanstack/react-query";

interface IStreamerCalendarPage {
  params: { id: string };
  searchParams: { date?: string };
}

const StreamerCalendarPage = async ({
  params,
  searchParams,
}: IStreamerCalendarPage) => {
  const { id } = await params;
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonthWithId(targetDate, id),
    queryFn: () => getScheduleListByMonthWithId(targetDate, id),
  });

  return <CalendarView date={targetDate} id={id} />;
};

export default StreamerCalendarPage;
