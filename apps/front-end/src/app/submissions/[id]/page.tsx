import Link from "next/link";
import { notFound } from "next/navigation";

type Receipt = { id: string; status: "pending" | "approved" | "rejected" };

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
    <p className="mb-2">접수 번호: <code>{receipt.id}</code></p>
    <p className="mb-4">현재 상태: <strong>{label}</strong></p>
    <p className="mb-6 text-sm text-textNormal">이 주소를 보관하면 나중에 처리 상태를 다시 확인할 수 있습니다.</p>
    <Link href="/all/calendar" className="underline">일정 보기</Link>
  </main>;
}
