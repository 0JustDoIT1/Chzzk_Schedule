import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import ChzzkCommonLayout from "@/lib/screens/layout/chzzkLayout";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `치지직 공식 스케줄`,
  description: `치지직 공식 스케줄을 확인해보세요.`,
  openGraph: {
    title: `치지직 공식 스케줄`,
    description: `치지직 공식 스케줄을 확인해보세요.`,
  },
};

export default async function ChzzkLayout({ children }: PropsWithChildren) {
  return <ChzzkCommonLayout>{children}</ChzzkCommonLayout>;
}
