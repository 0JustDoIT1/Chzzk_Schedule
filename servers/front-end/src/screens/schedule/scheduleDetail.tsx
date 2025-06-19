"use client";

import {
  categoryColorMap,
  categoryJson,
} from "@/lib/constants/streamingCategory";
import { usePathname, useRouter } from "next/navigation";
import CalendarTimeIcon from "~/public/assets/svg/calendar-time";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../../components/link";
import { route } from "@/lib/constants/router";
import { BrandButton } from "@/components/button";
import { useQuery } from "@tanstack/react-query";
import { getScheduleById } from "@/api/schedule-api";
import IsLoading from "@/components/isLoading";
import IsError from "@/components/isError";
import { TScheduleSchema } from "@/schemas/schedule.schema";
import { dateToFormatString } from "@/lib/utils/dateFormat";
import UsersIcon from "~/public/assets/svg/users";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import Link from "next/link";

const ScheduleDetailView = () => {
  const router = useRouter();
  const pathName = usePathname();
  const id = pathName.split("/")[pathName.split("/").length - 1];

  const category = categoryJson();

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["getScheduleById", id],
    queryFn: () => getScheduleById(id),
  });

  const displayDate = (data: TScheduleSchema) => {
    const startAtDate = dateToFormatString(data.startAt, "YYYY-MM-DD");
    const startAtTime = dateToFormatString(data.startAt, "HH:mm");
    const endAtDate = dateToFormatString(data.startAt, "YYYY-MM-DD");
    const endAtTime = dateToFormatString(data.startAt, "HH:mm");

    let result = startAtDate;
    if (startAtDate === endAtDate) {
      if (startAtTime === endAtTime) {
        result += ` ${startAtTime}`;
      } else {
        result += ` ${startAtTime} - ${endAtTime}`;
      }
    } else {
      result += ` ${startAtTime} ~ ${endAtDate} ${endAtTime}`;
    }

    return result;
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <section className="w-full">
      {isSuccess && (
        <div className="w-full mx-auto flex flex-col md:container md:p-8 lg:max-w-6xl">
          <Link target="_blank" href={data.chzzkLink} className="flex mb-2">
            <p className="text-xl mr-2">
              <span
                className={`mr-2 font-semibold ${
                  categoryColorMap[data.category]
                }`}
              >
                &#91;{category[data.category]}&#93;
              </span>
              {data.title}
            </p>
            <ArrowUpRightFromSquareIcon className="w-6 h-6 mr-2" />
          </Link>
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
              href={`${route.scheduleEdit}?schedule=${data._id}`}
              classes="w-auto min-w-20"
              scroll={false}
            >
              일정 수정
            </BrandLink>
            <BrandButton
              type="button"
              color="green"
              classes="w-auto min-w-20"
              onClick={() => router.back()}
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
