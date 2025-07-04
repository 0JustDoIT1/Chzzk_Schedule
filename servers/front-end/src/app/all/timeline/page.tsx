import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { IMonthSchedule } from "@/schemas/schedule.schema";
import AllTimelineView from "@/screens/all/timeline";
import { QueryClient } from "@tanstack/react-query";

interface IAllTimelinePage {
  searchParams: { date?: string };
}

const AllTimelinePage = async ({ searchParams }: IAllTimelinePage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<IMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <AllTimelineView date={targetDate} />;
};

export default AllTimelinePage;
