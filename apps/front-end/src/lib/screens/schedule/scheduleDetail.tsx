"use client";

import { useRouter } from "next/navigation";
import CalendarTimeIcon from "~/public/assets/svg/calendar-time";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../../components/common/link";
import { getRoute, goBackRoute, route } from "@/lib/constants/router";
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

interface IScheduleDetailView {
  id: string;
}

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
    <section className="w-full">
      {isSuccess && (
        <div className="w-full mx-auto flex flex-col md:container md:p-8 lg:max-w-6xl">
          <div className="mb-1">
            <CategoryTag
              category={data.category}
              className="text-xs font-medium"
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl mr-2">
              <span>{data.title}</span>
            </h3>
            <Link target="_blank" href={data.chzzkLink}>
              <ArrowUpRightFromSquareIcon className="w-6 h-6 text-brandMain" />
            </Link>
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
            {data.member && (
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
          {data.contents && (
            <div className="relative mb-4">
              <div
                className="border border-textLight rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: data.contents }}
              />
              <div className="absolute -top-2 left-4 bg-white px-2">
                <p className="text-sm text-textNormal">일정 내용</p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <BrandLink
              href={getRoute(route.scheduleEdit, data._id)}
              className="w-auto min-w-20"
              scroll={false}
            >
              일정 수정
            </BrandLink>
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
