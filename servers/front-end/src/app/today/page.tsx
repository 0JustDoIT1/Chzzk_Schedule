import { getScheduleListByDate } from "@/api/schedule-api";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { IDateSchedule } from "@/schemas/schedule.schema";
import TodayScreen from "@/screens/today/todayScreen";

const TodayPage = async () => {
  const today = dateToFormatString(getToday(), "YYYY-MM-DD");
  const date = dateTypeToDate(today);

  const queryClient = new QueryClient();

  // 서버에서 데이터 미리 받아두기
  await queryClient.prefetchQuery<IDateSchedule>({
    queryKey: ["getScheduleListByDate", date],
    queryFn: () => getScheduleListByDate(date),
  });

  const scheduleList =
    queryClient.getQueryData<IDateSchedule>(["getScheduleListByDate", date]) ??
    {};

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodayScreen scheduleList={scheduleList} date={date} />
    </HydrationBoundary>
  );
};

export default TodayPage;
