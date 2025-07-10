import { getScheduleById } from "@/api/schedule-api";
import { getAllStreamerList } from "@/api/streamer-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface IScheduleEditLayout {
  children: React.ReactNode;
  params: { schedule: string };
}

export default async function ScheduleEditLayout({
  children,
  params,
}: IScheduleEditLayout) {
  const { schedule } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getScheduleById(schedule),
    queryFn: () => getScheduleById(schedule),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
