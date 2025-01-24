"use client";

import useCalendar from "@/hook/calendar";
import { dateToFormatString } from "@/utils/dateFormat";
import dayjs from "dayjs";
import Link from "next/link";
import PlusIcon from "assets/svg/plus";
import { TestDayList } from "@/constants/test";
import React from "react";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";

const AllSchedulePage = () => {
  const { today, setToday, dayArray, week } = useCalendar();

  const preMonth = () => {
    setToday(dayjs(today).subtract(1, "month"));
  };

  const nextMonth = () => {
    setToday(dayjs(today).add(1, "month"));
  };

  const presentMonth = () => {
    setToday(dayjs());
  };

  const streamWidth: { [x: number]: string } = {
    0: "w-full",
    1: "w-[calc(200%+1px)]",
    2: "w-[calc(300%+1px)]",
    3: "w-[calc(400%+1px)]",
    4: "w-[calc(500%+1px)]",
    5: "w-[calc(600%+1px)]",
    6: "w-[calc(700%+1px)]",
  };

  const streamTopMargin: { [x: number]: string } = {
    0: "mt-0",
    1: "mt-[22px]",
    2: "mt-[44px]",
    3: "mt-[66px]",
  };

  const streamText = (dateDiff: number, preList: number, column: number) => {
    const index = dateDiff > 6 - column ? 6 - column : dateDiff;

    return `${`${streamWidth[index]} ${streamTopMargin[preList]} flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-gray-900 text-xs truncate`}`;
  };

  return (
    <main className="bg-white w-full flex flex-col items-center">
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-[1200px]">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">전체 일정</p>
            <p className="text-sm text-gray-500">
              {/* <span className="text-base text-brandMain">
                {dateToFormatString(new Date(), "YYYY년 MM월 DD일 dddd")}
              </span> */}
              &nbsp;치지직 방송 일정을 한눈에 살펴보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3">
            <button onClick={preMonth}>
              <AngleLeftIcon className="w-6 h-6 text-gray-900" />
            </button>
            <p className="mx-2 mt-1">
              {dateToFormatString(today, "YYYY년 MM월")}
            </p>
            <button onClick={nextMonth}>
              <AngleRightIcon className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          <div className="flex justify-center w-full md:w-1/3 md:justify-end">
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
        <div className="container mx-auto md:px-8 md:flex-row lg:max-w-[1200px]">
          <div className="box-border w-full border-x border-x-gray-300 divide-y divide-y-gray-300">
            <div className="grid grid-cols-7 divide-x divide-x-gray-300">
              {week.map((item) => (
                <div
                  key={item}
                  className={`h-8 leading-8 text-center text-sm ${
                    item === "일"
                      ? "text-red-600"
                      : item === "토"
                      ? "text-blue-600"
                      : "text-black"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            {dayArray.map((week, row) => (
              <div
                key={row}
                className="grid grid-cols-7 divide-x divide-x-gray-300"
              >
                {week[row].map((day, column) => {
                  const todayCheck =
                    dateToFormatString(new Date(), "YYYY-MM-DD") ===
                    dateToFormatString(day, "YYYY-MM-DD");
                  const monthCheck =
                    dateToFormatString(today, "YYYY-MM") ===
                    dateToFormatString(day, "YYYY-MM");

                  return (
                    <div key={day.unix()} className="relative h-36">
                      <div
                        className={`pl-1 py-1 text-left text-xs ${
                          monthCheck ? "font-normal" : "font-light"
                        } ${
                          monthCheck && column === 0
                            ? "text-red-600"
                            : monthCheck && column === 6
                            ? "text-blue-600"
                            : monthCheck
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        {todayCheck ? (
                          <div className="flex items-center justify-center w-6 h-6 bg-brandMain rounded-full text-white">
                            {dateToFormatString(day, "D")}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                            {dateToFormatString(day, "D")}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-[2px]">
                        {TestDayList.map((item) => {
                          const dateCheck =
                            item.day === dateToFormatString(day, "YYYY-MM-DD");
                          const todayViewLength = 4 - item.preList.length;
                          const todayViewCheck = todayViewLength > 0;

                          const etc =
                            item.list.length + item.preList.length - 4;
                          const etcCheck = dateCheck && etc > 0;

                          return (
                            <React.Fragment key={item.day}>
                              {dateCheck &&
                                column === 0 &&
                                item.preList.map((stream) => {
                                  const dateDiff = dayjs(stream.endAt).diff(
                                    item.day,
                                    "day"
                                  );
                                  return (
                                    <Link
                                      key={stream.title}
                                      href="/schedule/detail"
                                      className={streamText(dateDiff, 0, 0)}
                                    >
                                      {stream.title}
                                    </Link>
                                  );
                                })}
                              {dateCheck &&
                                todayViewCheck &&
                                item.list
                                  .slice(0, todayViewLength)
                                  .map((stream) => {
                                    const dateDiff = dayjs(stream.endAt).diff(
                                      item.day,
                                      "day"
                                    );
                                    return (
                                      <Link
                                        key={stream.title}
                                        href="/schedule/detail"
                                        className={streamText(
                                          dateDiff,
                                          item.preList.length,
                                          column
                                        )}
                                      >
                                        {stream.title}
                                      </Link>
                                    );
                                  })}
                              {etcCheck && (
                                <Link
                                  href="/all"
                                  className="flex items-center justify-center w-full h-5 px-1 bg-brandMain rounded-md text-white text-xs font-light truncate"
                                >
                                  {etc}개 더보기
                                </Link>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AllSchedulePage;
