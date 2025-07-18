import { getScheduleById } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface IDetailIdModalLayout {
  children: React.ReactNode;
  params: { id: string };
}

export default async function DetailIdModalLayout({
  children,
  params,
}: IDetailIdModalLayout) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getScheduleById(id),
    queryFn: () => getScheduleById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
