import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { IMonthSchedule } from "@/schemas/schedule.schema";
import AllCalendarView from "@/screens/all/calendar";
import { QueryClient } from "@tanstack/react-query";

interface IAllCalendarPage {
  searchParams: { date?: string };
}

const AllCalendarPage = async ({ searchParams }: IAllCalendarPage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<IMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <AllCalendarView date={targetDate} />;
};

export default AllCalendarPage;
