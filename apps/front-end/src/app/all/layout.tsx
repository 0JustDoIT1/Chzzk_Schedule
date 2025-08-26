import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import AllCommonLayout from "@/lib/screens/layout/allLayout";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `치지직 스케줄`,
  description: `치지직 스케줄을 확인해보세요.`,
  openGraph: {
    title: `치지직 스케줄`,
    description: `치지직 스케줄을 확인해보세요.`,
  },
};

export default async function AllLayout({ children }: PropsWithChildren) {
  return <AllCommonLayout>{children}</AllCommonLayout>;
}
