"use client";

import useCalendar from "@/lib/hook/useCalendar";
import { dateToFormatString } from "@/lib/utils/dateFormat";
import { TestDayList } from "@/lib/constants/test";
import React from "react";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";
import { AddScheduleLink } from "@/components/link";
import CustomDayline from "@/components/dayline";
import TimelineIcon from "~/public/assets/svg/timeline";
import CalendarIcon from "~/public/assets/svg/calendar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { route } from "@/lib/constants/router";
import { BrandButton, CustomButton } from "@/components/button";

const AllTimelineView = () => {
  const pathName = usePathname();

  const { today, setPreMonth, setNextMonth, setPresentMonth } = useCalendar();

  const linkClassName = (path: string) => {
    let className = "";
    pathName === path
      ? (className +=
          "w-full max-w-40 rounded-md px-3 py-2 text-sm bg-textHover text-textMain/90 md:w-auto hover:bg-textHover")
      : (className +=
          "w-full max-w-40 rounded-md px-3 py-2 text-sm bg-white text-textMain/90 md:w-auto hover:bg-textHover");

    return className;
  };

  return (
    <>
      <section className="w-full border-b border-b-textLight py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">전체 일정</p>
            <p className="text-sm text-textNormal">
              치지직 방송 일정을 한눈에 살펴보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3">
            <CustomButton onClick={setPreMonth}>
              <AngleLeftIcon className="w-6 h-6 text-textMain" />
            </CustomButton>
            <p className="mx-2 mt-1">
              {dateToFormatString(today, "YYYY년 MM월")}
            </p>
            <CustomButton onClick={setNextMonth}>
              <AngleRightIcon className="w-6 h-6 text-textMain" />
            </CustomButton>
          </div>
          <div className="flex justify-center w-full md:w-1/3 md:justify-end">
            <BrandButton className="mr-2 w-16" onClick={setPresentMonth}>
              오늘
            </BrandButton>
            <AddScheduleLink className="w-full max-w-64 md:w-auto" />
          </div>
        </div>
      </section>
      <main className="w-full md:container mx-auto flex flex-col items-start justify-start md:px-8 md:flex-row lg:max-w-6xl">
        <aside className="w-full h-full flex flex-row justify-center gap-2 py-6 px-2 border-b border-b-textSuperLight md:flex-col md:justify-start md:w-44 md:border-r md:border-r-textSuperLight md:border-b-0">
          <p className="hidden mb-2 text-textNormal text-sm md:inline-block">
            일정 형태
          </p>
          <Link
            className={linkClassName(route.allCalendar)}
            href={route.allCalendar}
          >
            <div className="w-full flex justify-center md:justify-start">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <p>캘린더</p>
            </div>
          </Link>
          <Link
            className={linkClassName(route.allTimeline)}
            href={route.allTimeline}
          >
            <div className="w-full flex justify-center md:justify-start">
              <TimelineIcon className="w-4 h-4 mr-2" />
              <p>타임라인</p>
            </div>
          </Link>
        </aside>
        <section className="w-full pt-12">
          <CustomDayline schedule={TestDayList} date={today} />
        </section>
      </main>
    </>
  );
};

export default AllTimelineView;
