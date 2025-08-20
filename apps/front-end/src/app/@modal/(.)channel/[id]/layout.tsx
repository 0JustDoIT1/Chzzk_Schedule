import { getScheduleLinkById } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface IChannelModalLayout {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ChannelModalLayout({
  children,
  params,
}: IChannelModalLayout) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.getScheduleLinkById(id),
    queryFn: () => getScheduleLinkById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
