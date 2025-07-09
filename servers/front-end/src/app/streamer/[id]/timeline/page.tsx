import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import TimelineView from "@/screens/timelineView";
import { QueryClient } from "@tanstack/react-query";

interface IStreamerTimelinePage {
  searchParams: { date?: string };
}

const StreamerTimelinePage = async ({
  searchParams,
}: IStreamerTimelinePage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <TimelineView date={targetDate} />;
};

export default StreamerTimelinePage;
