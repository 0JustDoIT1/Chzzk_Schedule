import StreamerCommonLayout from "@/screens/layout/streamerLayout";
import { ReactNode } from "react";

interface IChzzkLayout {
  children: ReactNode;
  params: { id: string };
}

export default async function ChzzkLayout({ children, params }: IChzzkLayout) {
  const { id } = await params;
  return <StreamerCommonLayout id={id}>{children}</StreamerCommonLayout>;
}
