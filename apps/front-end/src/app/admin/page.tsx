import { isAdminSession, login, logout, review } from "./actions";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Submission = {
  _id: string;
  kind: string;
  payload: Record<string, unknown>;
  sourceUrl: string;
  createdAt?: string;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await isAdminSession())) {
    const { error } = await searchParams;
    return <main className="min-h-[calc(100vh-72px)] bg-[#f7faf8] px-4 py-10"><div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="mb-4 text-2xl font-bold">관리자 검수</h1>
      {error && <p role="alert" className="mb-4 text-red-700">{error === "locked" ? "로그인 시도가 많아 잠시 후 다시 시도해 주세요." : "로그인 정보를 확인해 주세요."}</p>}
      <form action={login} className="flex flex-col gap-3">
        <label htmlFor="username">관리자 계정</label>
        <input id="username" name="username" type="text" autoComplete="username" required className="rounded border p-2" />
        <label htmlFor="password">관리자 비밀번호</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="rounded border p-2" />
        <button className="rounded bg-brandMain p-2 text-white">로그인</button>
      </form>
    </div></main>;
  }

  const token = (await cookies()).get("admin_review")?.value;
  const baseUrl = process.env.API_URL;
  if (!token || !baseUrl) return <main className="p-8">관리자 API 설정이 필요합니다.</main>;
  const response = await fetch(`${baseUrl}/v1/submissions/pending`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return <main className="p-8">제보 목록을 불러오지 못했습니다.</main>;
  const submissions = await response.json() as Submission[];
  return <main className="min-h-[calc(100vh-72px)] bg-[#f7faf8] px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold text-textMain">검수 대기 제보</h1><form action={logout}><button className="font-medium text-brandDark underline">로그아웃</button></form></div>
    {submissions.length === 0 && <p>대기 중인 제보가 없습니다.</p>}
    <div className="space-y-6">{submissions.map((submission) => <article key={submission._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold">{submission.kind} · {submission.createdAt ?? ""}</h2>
      <p className="my-2 break-all">출처: <a className="underline" href={submission.sourceUrl} target="_blank" rel="noreferrer">{submission.sourceUrl}</a></p>
      <pre className="overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm">{JSON.stringify(submission.payload, null, 2)}</pre>
      <form action={review} className="mt-4 flex flex-wrap gap-2">
        <input type="hidden" name="id" value={submission._id} />
        <input type="hidden" name="kind" value={submission.kind} />
        <label className="flex w-full flex-col gap-1">게시할 내용(JSON)
          <textarea name="payload" defaultValue={JSON.stringify(submission.payload, null, 2)} rows={10} required className="w-full min-w-0 rounded border p-2 font-mono text-sm" />
        </label>
        {submission.kind !== "streamer" ? <label className="flex flex-col gap-1">방송 분류
          <select name="category" defaultValue={String(submission.payload.category ?? "personal")} className="rounded border p-2">
            <option value="personal">개인</option><option value="together">합방</option><option value="content">콘텐츠</option><option value="match">대회</option>
            <option value="official">치지직 공식 콘텐츠</option><option value="watch">치지직 공식 같이보기</option>
          </select>
        </label> : <label className="flex items-center gap-2"><input type="checkbox" name="isOfficial" defaultChecked={submission.payload.isOfficial === true} />치지직 공식 채널</label>}
        <label className="flex w-full flex-col gap-1">확인한 출처 URL
          <input name="sourceUrl" type="url" required defaultValue={submission.sourceUrl} className="rounded border p-2" />
        </label>
        {submission.kind !== "streamer" && <label className="flex w-full flex-col gap-1">{submission.kind === "schedule-edit" ? "변경 요약 *" : "게시 메모"}
          <input name="changeNote" type="text" required={submission.kind === "schedule-edit"} maxLength={300} placeholder="예: 방송 시작 시간을 변경했습니다" className="rounded border p-2" />
        </label>}
        {submission.kind === "schedule-edit" && <label className="flex flex-col gap-1">일정 상태
          <select name="status" defaultValue={String(submission.payload.status ?? "scheduled")} className="rounded border p-2">
            <option value="scheduled">예정</option><option value="cancelled">취소</option>
          </select>
        </label>}
        <label className="flex w-full items-center gap-2"><input type="checkbox" name="officialConfirmed" />공식으로 게시하는 경우, 치지직 직접 주최·공식 채널 공지를 확인했습니다.</label>
        <button name="action" value="approve" className="rounded bg-green-700 px-4 py-2 text-white">수정한 내용으로 게시</button>
        <label className="flex flex-col gap-1">공개 반려 사유
          <select name="rejectionCode" required className="rounded border p-2">
            <option value="source_unverifiable">출처를 확인할 수 없음</option>
            <option value="duplicate">이미 접수되거나 게시된 내용</option>
            <option value="insufficient_details">일정 정보가 부족함</option>
            <option value="out_of_scope">서비스 범위에 맞지 않음</option>
          </select>
        </label>
        <input name="reason" aria-label="내부 검수 메모" placeholder="내부 검수 메모 (제보자에게 비공개)" maxLength={500} className="rounded border p-2" />
        <button name="action" value="reject" className="rounded bg-red-700 px-4 py-2 text-white">반려</button>
      </form>
    </article>)}</div>
  </div></main>;
}
