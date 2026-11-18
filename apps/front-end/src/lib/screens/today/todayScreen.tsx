"use client";

import { AddScheduleLink } from "@/lib/components/common/link";
import CustomTimeline from "@/lib/components/timeline/timeline";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getScheduleListByDate } from "@/api/schedule-api";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";
import { queryKeys } from "@/lib/constants/react-query";
import { dateToFormatString, dateTypeToDate, getToday } from "@shared/utils";

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
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex flex-col">
            <h1 className="mb-1 text-3xl font-bold text-textMain">오늘의 일정</h1>
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
      <main className="min-h-[calc(100vh-180px)] bg-[#f7faf8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {isSuccess && <CustomTimeline schedule={data} />}
        </div>
      </main>
    </>
  );
};

export default TodayScreen;
