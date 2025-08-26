import { getScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import TimelineView from "@/lib/screens/timelineView";
import { QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IStreamerTimelinePage {
  params: Promise<{ name: string }>;
  searchParams: { date?: string };
}

const StreamerTimelinePage = async ({
  params,
  searchParams,
}: IStreamerTimelinePage) => {
  const { name } = await params;
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getScheduleListByMonth(targetDate),
    queryFn: () => getScheduleListByMonth(targetDate),
  });

  return <TimelineView date={targetDate} name={name} />;
};

export default StreamerTimelinePage;
