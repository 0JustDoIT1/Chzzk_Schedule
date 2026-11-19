"use client";

import { useRouter } from "next/navigation";
import CalendarTimeIcon from "~/public/assets/svg/calendar-time";
import UserIcon from "~/public/assets/svg/user";
import { goBackRoute, route } from "@/lib/constants/router";
import { BrandButton } from "@/lib/components/common/button";
import { useQuery } from "@tanstack/react-query";
import { getScheduleById } from "@/api/schedule-api";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";
import UsersIcon from "~/public/assets/svg/users";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import Link from "next/link";
import { displayDate } from "@/lib/utils/chzzk-date";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { queryKeys } from "@/lib/constants/react-query";
import CategoryTag from "@/lib/components/common/categoryTag";
import { safeExternalUrl } from "@/lib/utils/externalUrl";

interface IScheduleDetailView {
  id: string;
}

const fieldLabel: Record<string, string> = {
  isOfficial: "공식 분류", streamerName: "주최자", category: "방송 종류",
  title: "제목", member: "참여자", fullDay: "종일 여부",
  startAt: "시작 시간", endAt: "종료 시간", contents: "내용",
  startTimeKnown: "시작 시간 확정", endTimeKnown: "종료 시간 확정", status: "일정 상태",
};

const ScheduleDetailView = ({ id }: IScheduleDetailView) => {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleById(id),
    queryFn: () => getScheduleById(id),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#f7faf8] px-4 py-8 sm:px-6 md:py-12">
      {isSuccess && (
        <div className="mx-auto flex w-full max-w-4xl flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-1">
            <CategoryTag
              category={data.category}
              className="text-xs font-medium"
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="mr-2 text-2xl font-bold leading-snug text-textMain">
              <span>{data.status === "cancelled" ? `[취소] ${data.title}` : data.title}</span>
            </h1>
            {safeExternalUrl(data.chzzkLink) && <Link target="_blank" rel="noopener noreferrer" aria-label="방송 채널 열기" href={safeExternalUrl(data.chzzkLink)!}>
              <ArrowUpRightFromSquareIcon className="w-6 h-6 text-brandMain" />
            </Link>}
          </div>
          <div className="flex flex-col gap-2 mb-2 text-textNormal text-sm">
            <div className="flex items-center">
              <CalendarTimeIcon className="w-6 h-6 mr-2" />
              <p className="mt-[2px]">{displayDate(data)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-1 text-textNormal text-sm">
            <div className="flex items-center">
              <UserIcon className="w-6 h-6 mr-2" />
              <p className="mt-[2px]">{data.streamerName}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-8 text-textNormal text-sm">
            {data.member && data.member.length > 0 && (
              <div className="flex flex-wrap items-center">
                <UsersIcon className="w-6 h-6 mr-2" />
                {data.member.map((name, index) => {
                  const memberLength = data.member?.length;
                  const displayName =
                    memberLength === index + 1 ? name : `${name},`;
                  return (
                    <p key={name} className="mt-[2px] mr-2">
                      {displayName}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          {data.revisionHistory && data.revisionHistory.length > 1 && <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-textNormal"><details>
              <summary className="cursor-pointer font-medium text-textMain">변경 이력 {data.revisionHistory.length - 1}건 보기</summary>
              <ol className="mt-3 space-y-3">
                {[...data.revisionHistory].slice(1).reverse().map((revision) => <li key={revision.version} className="border-t border-gray-200 pt-2">
                  <p>{new Date(revision.reviewedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} · {revision.note}</p>
                  {revision.changedFields.length > 0 && <p>변경 항목: {revision.changedFields.map((field) => fieldLabel[field] ?? field).join(", ")}</p>}
                </li>)}
              </ol>
            </details></div>}
          {data.contents && (
            <div className="relative mb-4">
              <div
                className="whitespace-pre-wrap break-words border border-textLight rounded-lg p-4"
              >{data.contents}</div>
              <div className="absolute -top-2 left-4 bg-white px-2">
                <p className="text-sm text-textNormal">일정 내용</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <BrandButton
              type="button"
              color="green"
              className="w-auto min-w-20"
              onClick={() => goBackRoute(router, previousAsPath, route.today)}
            >
              확인
            </BrandButton>
          </div>
        </div>
      )}
    </section>
  );
};

export default ScheduleDetailView;
