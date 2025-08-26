import { getScheduleById } from "@/api/schedule-api";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { queryKeys } from "@/lib/constants/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface IDetailIdLayout {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `스케줄 자세히`,
  description: `해당 스케줄을 자세히 살펴보세요.`,
  openGraph: {
    title: `스케줄 자세히`,
    description: `해당 스케줄을 자세히 살펴보세요.`,
  },
};

export default async function DetailIdLayout({
  children,
  params,
}: IDetailIdLayout) {
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
