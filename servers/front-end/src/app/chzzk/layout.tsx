import ChzzkCommonLayout from "@/lib/screens/layout/chzzkLayout";
import { PropsWithChildren } from "react";

export default async function ChzzkLayout({ children }: PropsWithChildren) {
  return <ChzzkCommonLayout>{children}</ChzzkCommonLayout>;
}
