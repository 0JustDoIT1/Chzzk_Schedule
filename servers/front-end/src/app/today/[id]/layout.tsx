import { getScheduleById } from "@/api/schedule-api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface ITodayIdLayout {
  children: React.ReactNode;
  params: { id: string };
}

export default async function TodayIdLayout({
  children,
  params,
}: ITodayIdLayout) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getScheduleById", id],
    queryFn: () => getScheduleById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
