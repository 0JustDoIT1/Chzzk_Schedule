import { getOfficialScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";

import TimelineView from "@/lib/screens/timelineView";
import { QueryClient } from "@tanstack/react-query";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

interface IChzzkTimelinePage {
  searchParams: { date?: string };
}

const ChzzkTimelinePage = async ({ searchParams }: IChzzkTimelinePage) => {
  const { date } = await searchParams;
  const dateStr = date || dateToFormatString(getToday(), "YYYY-MM-DD");
  const targetDate = dateTypeToDate(dateStr);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<TMonthSchedule>({
    queryKey: queryKeys.getOfficialScheduleListByMonth(targetDate),
    queryFn: () => getOfficialScheduleListByMonth(targetDate),
  });

  return <TimelineView date={targetDate} isOfficial={true} />;
};

export default ChzzkTimelinePage;
