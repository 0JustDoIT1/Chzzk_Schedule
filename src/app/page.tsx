import CustomTimeline from "@/components/timeline";
import { TestTodayList } from "@/constants/test";
import { dateToFormatString } from "@/utils/dateFormat";
import PlusIcon from "assets/svg/plus";
import Link from "next/link";
import React from "react";

const HomePage = () => {
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
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col">
            <p className="text-2xl">오늘의 일정</p>
            <p className="text-sm text-gray-500">
              <span className="text-base text-brandMain">
                {dateToFormatString(new Date(), "YYYY년 MM월 DD일 dddd")}
              </span>
              &nbsp;치지직 방송일정입니다.
            </p>
          </div>
          <div className="w-full max-w-xs md:w-auto">
            <Link
              href="/schedule/add"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PlusIcon className="w-4 h-4 text-gray-800 mt-[0.5]" />
              일정 추가
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <CustomTimeline schedule={TestTodayList} />
      </section>
    </React.Fragment>
  );
};

export default HomePage;
