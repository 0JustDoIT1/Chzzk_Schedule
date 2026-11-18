"use client";

import { ReactNode, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getDatePreservedRoute, getRoute, route } from "@/lib/constants/router";
import useCalendar from "@/lib/hook/useCalendar";
import { BrandButton } from "@/lib/components/common/button";
import { AddScheduleLink } from "@/lib/components/common/link";
import CalendarIcon from "~/public/assets/svg/calendar";
import TimelineIcon from "~/public/assets/svg/timeline";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";
import Link from "next/link";
import clsx from "clsx";
import { dateToFormatString } from "@shared/utils";

interface IStreamerCommonLayout {
  children: ReactNode;
  name: string;
}

export default function StreamerCommonLayout({
  children,
  name,
}: IStreamerCommonLayout) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { today, setPreMonth, setNextMonth, setPresentMonth } = useCalendar();

  const linkClassName = (path: string) =>
    clsx(
      "w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors md:w-auto",
      pathName.includes(path) ? "bg-green-50 text-brandDark ring-1 ring-green-200" : "text-textNormal",
      "hover:bg-green-50 hover:text-brandDark"
    );

  const calendarHref = useMemo(
    () =>
      getDatePreservedRoute(
        getRoute(route.streamer, name, route.calendar),
        searchParams
      ),
    [name, searchParams]
  );

  const timelineHref = useMemo(
    () =>
      getDatePreservedRoute(
        getRoute(route.streamer, name, route.timeline),
        searchParams
      ),
    [name, searchParams]
  );

  return (
    <>
      <section className="w-full border-b border-gray-100 bg-white py-7 md:py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="text-center xl:text-left">
            <p className="mb-1 text-3xl font-bold tracking-tight text-textMain">{name} 일정</p>
            <p className="text-sm leading-relaxed text-textNormal">
              {name} 방송 일정을 한눈에 살펴보세요.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 shadow-sm">
            <BrandButton className="mr-1 min-w-14 px-3" onClick={setPresentMonth}>오늘</BrandButton>
            <button type="button" onClick={setPreMonth} aria-label="이전 달" className="rounded-lg p-1.5 hover:bg-white">
              <AngleLeftIcon className="w-6 h-6 text-textMain" />
            </button>
            <p className="min-w-28 text-center text-lg font-bold tracking-tight text-textMain">
              {dateToFormatString(today, "YYYY년 MM월")}
            </p>
            <button type="button" onClick={setNextMonth} aria-label="다음 달" className="rounded-lg p-1.5 hover:bg-white">
              <AngleRightIcon className="w-6 h-6 text-textMain" />
            </button>
          </div>
          <div className="flex justify-center xl:justify-end">
            <AddScheduleLink className="w-full max-w-64 md:w-auto" />
          </div>
        </div>
      </section>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 bg-[#f7faf8] px-4 py-6 sm:px-6 lg:flex-row lg:px-8 lg:py-8">
        <aside className="flex w-full shrink-0 flex-row gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:w-48 lg:flex-col lg:gap-1 lg:p-4">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-textNormal lg:block">
            일정 형태
          </p>
          <Link className={linkClassName(route.calendar)} href={calendarHref}>
            <div className="flex w-full items-center justify-center lg:justify-start">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <p>캘린더</p>
            </div>
          </Link>
          <Link className={linkClassName(route.timeline)} href={timelineHref}>
            <div className="flex w-full items-center justify-center lg:justify-start">
              <TimelineIcon className="w-4 h-4 mr-2" />
              <p>타임라인</p>
            </div>
          </Link>
        </aside>
        <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">{children}</section>
      </main>
    </>
  );
}
