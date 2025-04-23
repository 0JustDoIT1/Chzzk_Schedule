"use client";

import { AddScheduleLink } from "@/components/link";
import CustomTimeline from "@/components/timeline";
import { TestTodayList } from "@/constants/test";
import { dateToFormatString, getToday } from "@/utils/dateFormat";
import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <React.Fragment>
      {/* <div className="text-center p-4">
        <div className="text-6xl font-bold text-white my-4">0's Life</div>
        <div className="text-2xl text-white my-4">인터넷 방송 스케줄러</div>
        <div className="w-full rounded-md bg-white bg-opacity-10 p-4">
          0's Life는 치지직 스트리머들의 방송일정을 한눈에 모아보는
          웹사이트입니다. 누구나 방송일정을 만들고 수정하고 공유할 수 있으니,
          많은 참여 부탁드립니다.
        </div>
      </div> */}
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
            <AddScheduleLink classes="w-full" />
          </div>
        </div>
      </section>
      <main className="w-full py-12">
        <CustomTimeline schedule={TestTodayList} />
      </main>
    </React.Fragment>
  );
};

export default HomePage;
