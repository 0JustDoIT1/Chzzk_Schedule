import StreamerCommonLayout from "@/lib/screens/layout/streamerLayout";
import { generatePostMetadata } from "@/lib/utils/metaTag";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

interface IChzzkLayout {
  children: ReactNode;
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: IChzzkLayout): Promise<Metadata> {
  const { name } = await params;
  const decodeName = decodeURIComponent(name);

  return generatePostMetadata(
    `'${decodeName}'의 스케줄`,
    `'${decodeName}'의 스케줄을 확인해보세요.`
  );
}

export default async function ChzzkLayout({ children, params }: IChzzkLayout) {
  const { name } = await params;
  const decodeName = decodeURIComponent(name);

  return (
    <Suspense fallback={null}><StreamerCommonLayout name={decodeName}>{children}</StreamerCommonLayout></Suspense>
  );
}
