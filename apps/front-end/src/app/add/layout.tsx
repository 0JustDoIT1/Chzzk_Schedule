import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  ...DEFAULT_META_TAG,
  title: `스트리머 추가`,
  description: `원하는 스트리머를 추가해보세요.`,
  openGraph: {
    title: `스트리머 추가`,
    description: `원하는 스트리머를 추가해보세요.`,
  },
};

export default async function AllLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
