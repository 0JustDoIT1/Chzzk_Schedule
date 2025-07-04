import { PropsWithChildren } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import AllCommonLayout from "@/screens/all/commonLayout";

export default async function AllLayout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  //   await queryClient.prefetchQuery({ queryKey: ["schedules"], queryFn: getScheduleList });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllCommonLayout>{children}</AllCommonLayout>
    </HydrationBoundary>
  );
}
