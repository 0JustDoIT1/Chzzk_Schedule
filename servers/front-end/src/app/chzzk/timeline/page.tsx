import { getOfficialScheduleListByMonth } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import TimelineView from "@/lib/screens/timelineView";
import { QueryClient } from "@tanstack/react-query";

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
