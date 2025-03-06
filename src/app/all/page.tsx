"use client";

import useCalendar from "@/hook/useCalendar";
import { dateToFormatString } from "@/utils/dateFormat";
import Link from "next/link";
import PlusIcon from "assets/svg/plus";
import { TestDayList } from "@/constants/test";
import React from "react";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";
import CustomCalendar from "@/components/calendar";
import { BrandButton, CustomButton } from "@/components/button";
import { BrandLink } from "@/components/link";

const AllSchedulePage = () => {
  const { today, week, dayArray, setPreMonth, setNextMonth, setPresentMonth } =
    useCalendar();

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">전체 일정</p>
            <p className="text-sm text-gray-500">
              치지직 방송 일정을 한눈에 살펴보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3">
            <CustomButton onClick={setPreMonth}>
              <AngleLeftIcon className="w-6 h-6 text-gray-800" />
            </CustomButton>
            <p className="mx-2 mt-1">
              {dateToFormatString(today, "YYYY년 MM월")}
            </p>
            <CustomButton onClick={setNextMonth}>
              <AngleRightIcon className="w-6 h-6 text-gray-800" />
            </CustomButton>
          </div>
          <div className="flex justify-center w-full md:w-1/3 md:justify-end">
            <BrandButton
              classes="max-w-64 md:w-auto mr-2"
              onClick={setPresentMonth}
            >
              오늘
            </BrandButton>
            <BrandLink href="/schedule/add" classes="w-full max-w-64 md:w-auto">
              <PlusIcon className="w-4 h-4 text-gray-800 mt-[0.5]" />
              일정 추가
            </BrandLink>
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
    </React.Fragment>
  );
};

export default AllSchedulePage;
