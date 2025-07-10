import AllCommonLayout from "@/lib/screens/layout/allLayout";
import { PropsWithChildren } from "react";

export default async function AllLayout({ children }: PropsWithChildren) {
  return <AllCommonLayout>{children}</AllCommonLayout>;
}
