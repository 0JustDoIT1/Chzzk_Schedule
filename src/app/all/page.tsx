"use client";

import useCalendar from "@/hook/calendar";
import { dateToFormatString } from "@/utils/dateFormat";
import Link from "next/link";
import PlusIcon from "assets/svg/plus";
import { TestDayList } from "@/constants/test";
import React from "react";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";
import CustomCalendar from "@/components/calendar";

const AllSchedulePage = () => {
  const { today, week, dayArray, setPreMonth, setNextMonth, setPresentMonth } =
    useCalendar();

  return (
    <main className="bg-white w-full flex flex-col items-center">
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-[1200px]">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">전체 일정</p>
            <p className="text-sm text-gray-500">
              치지직 방송 일정을 한눈에 살펴보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3">
            <button onClick={setPreMonth}>
              <AngleLeftIcon className="w-6 h-6 text-gray-900" />
            </button>
            <p className="mx-2 mt-1">
              {dateToFormatString(today, "YYYY년 MM월")}
            </p>
            <button onClick={setNextMonth}>
              <AngleRightIcon className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          <div className="flex justify-center w-full md:w-1/3 md:justify-end">
            <button
              className="inline-flex max-w-64 justify-center rounded-md bg-white px-3 py-2 mr-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:w-auto"
              onClick={setPresentMonth}
            >
              오늘
            </button>
            <Link
              href="/schedule/add"
              className="inline-flex w-full max-w-64 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:w-auto"
            >
              <PlusIcon className="w-4 h-4 text-gray-900 mt-[0.5]" />
              일정 추가
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full">
        <CustomCalendar
          today={today}
          week={week}
          dayArray={dayArray}
          isHasSchedule={true}
          schedule={TestDayList}
        />
      </section>
    </main>
  );
};

export default AllSchedulePage;
