import { getAllStreamerList } from "@/api/streamer-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function StreamerLayout({
  children,
}: React.PropsWithChildren) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
