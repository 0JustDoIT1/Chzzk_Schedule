import AllCommonLayout from "@/screens/all/commonLayout";
import { ReactNode } from "react";

export default async function AllLayout({ children }: { children: ReactNode }) {
  return <AllCommonLayout>{children}</AllCommonLayout>;
}
