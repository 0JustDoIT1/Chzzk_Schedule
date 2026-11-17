import { getScheduleListByMonthWithName } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import TimelineView from "@/lib/screens/timelineView";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IStreamerTimelinePage {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ date?: string }>;
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
    queryKey: queryKeys.getScheduleListByMonthWithName(targetDate, name),
    queryFn: () => getScheduleListByMonthWithName(targetDate, name),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}><TimelineView date={targetDate} name={name} /></HydrationBoundary>;
};

export default StreamerTimelinePage;
