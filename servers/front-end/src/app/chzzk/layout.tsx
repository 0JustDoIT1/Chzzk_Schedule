import ChzzkCommonLayout from "@/screens/layout/chzzkLayout";
import { PropsWithChildren } from "react";

export default async function ChzzkLayout({ children }: PropsWithChildren) {
  return <ChzzkCommonLayout>{children}</ChzzkCommonLayout>;
}
