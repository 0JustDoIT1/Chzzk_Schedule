"use client";

import { categoryJson } from "@/lib/constants/streaming";
import { TestScheduleData } from "@/lib/constants/test";
import { usePathname, useRouter } from "next/navigation";
import CalendarTimeIcon from "~/public/assets/svg/calendar-time";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../../components/link";
import { route } from "@/lib/constants/router";
import { BrandButton } from "@/components/button";

const ScheduleDetailView = () => {
  const router = useRouter();
  const pathName = usePathname();
  const id = pathName.split("/")[pathName.split("/").length - 1];
  const data = TestScheduleData;

  const category = categoryJson();

  const displayDate = (data: any) => {
    let result = data.startAtDate;
    if (data.startAtDate === data.endAtDate) {
      if (data.startAtTime === data.endAtTime) {
        result += ` ${data.startAtTime}`;
      } else {
        result += ` ${data.startAtTime} - ${data.endAtTime}`;
      }
    } else {
      result += ` ${data.startAtTime} ~ ${data.endAtDate} ${data.endAtTime}`;
    }

    return result;
  };

  return (
    <section className="w-full">
      <div className="w-full mx-auto flex flex-col md:container md:p-8 lg:max-w-6xl">
        <div className="flex flex-col mb-4">
          <p className="text-xl">
            <span className="mr-2">&#91;{category[data.category]}&#93;</span>
            {data.title}
          </p>
        </div>
        <div className="flex flex-col gap-2 mb-8 text-textNormal text-sm">
          <div className="flex items-center">
            <CalendarTimeIcon className="w-6 h-6 mr-2" />
            <p className="mt-[2px]">{displayDate(data)}</p>
          </div>
          {data.member && (
            <div className="flex flex-wrap items-center">
              <UserIcon className="w-6 h-6 mr-2" />
              {data.member.map((name, index) => {
                const memberLength = data.member.length;
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
        <div className="relative mb-4">
          <div
            className="border border-textLight rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: data.contents }}
          />
          <div className="absolute -top-2 left-4 bg-white px-2">
            <p className="text-sm text-textNormal">일정 내용</p>
          </div>
        </div>
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
    </section>
  );
};

export default ScheduleDetailView;
