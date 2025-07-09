import { getScheduleLinkById } from "@/api/schedule-api";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface IStreamingModalLayout {
  children: React.ReactNode;
  params: { id: string };
}

export default async function StreamingModalLayout({
  children,
  params,
}: IStreamingModalLayout) {
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
