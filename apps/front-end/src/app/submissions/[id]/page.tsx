import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type RejectionCode = "source_unverifiable" | "duplicate" | "insufficient_details" | "out_of_scope";
type Receipt = { id: string; status: "pending" | "approved" | "rejected"; rejectionCode?: RejectionCode };

const rejectionLabels: Record<RejectionCode, string> = {
  source_unverifiable: "출처를 확인할 수 없음",
  duplicate: "이미 접수되거나 게시된 내용",
  insufficient_details: "일정 정보가 부족함",
  out_of_scope: "서비스 범위에 맞지 않음",
};

export const dynamic = "force-dynamic";

export default async function SubmissionStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{48}$/i.test(id)) notFound();
  const response = await fetch(`${process.env.API_URL}/v1/submissions/${id}/status`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) return <main className="mx-auto max-w-xl p-8">처리 상태를 불러오지 못했습니다.</main>;
  const receipt = await response.json() as Receipt;
  const label = { pending: "검수 대기", approved: "게시 승인", rejected: "반려" }[receipt.status];
  return <main className="mx-auto max-w-xl p-8">
    <h1 className="mb-4 text-2xl">제보 처리 상태</h1>
    <p className="mb-2 break-all">접수 번호: <code>{receipt.id}</code></p>
    <p className="mb-4">현재 상태: <strong>{label}</strong></p>
    {receipt.status === "rejected" && receipt.rejectionCode && rejectionLabels[receipt.rejectionCode] &&
      <p className="mb-4">반려 사유: {rejectionLabels[receipt.rejectionCode]}</p>}
    <p className="mb-6 text-sm text-textNormal">이 주소를 보관하면 나중에 처리 상태를 다시 확인할 수 있습니다.</p>
    <Link href="/all/calendar" className="underline">일정 보기</Link>
  </main>;
}
