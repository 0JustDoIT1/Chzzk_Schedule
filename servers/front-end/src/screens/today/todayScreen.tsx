"use client";

import { AddScheduleLink } from "@/components/common/link";
import CustomTimeline from "@/components/timeline/timeline";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getScheduleListByDate } from "@/api/schedule-api";
import IsLoading from "@/components/layout/isLoading";
import IsError from "@/components/layout/isError";
import { queryKeys } from "@/lib/constants/react-query";

const TodayScreen = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  const today = dateToFormatString(getToday(), "YYYY-MM-DD");
  const date = dateTypeToDate(today);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleListByDate(date),
    queryFn: () => getScheduleListByDate(date),
    enabled: !!date,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <>
      <section className="w-full border-b border-b-textLight py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col">
            <p className="text-2xl">오늘의 일정</p>
            <p className="text-sm text-textNormal">
              <span className="text-base text-brandMain">
                {dateToFormatString(getToday(), "YYYY년 MM월 DD일 dddd")}
              </span>
              &nbsp;치지직 방송일정입니다.
            </p>
          </div>
          <div className="w-full max-w-xs md:w-auto">
            <AddScheduleLink className="w-full" />
          </div>
        </div>
      </section>
      <main className="w-full py-12">
        {isSuccess && <CustomTimeline schedule={data} />}
      </main>
    </>
  );
};

export default TodayScreen;
