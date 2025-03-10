"use client";

import useCalendar from "@/hook/useCalendar";
import { dateToFormatString } from "@/utils/dateFormat";
import PlusIcon from "assets/svg/plus";
import { TestDayList } from "@/constants/test";
import React, { useState } from "react";
import AngleLeftIcon from "~/public/assets/svg/angle-left";
import AngleRightIcon from "~/public/assets/svg/angle-right";
import CustomCalendar from "@/components/calendar";
import { BrandButton, CustomButton } from "@/components/button";
import { BrandLink } from "@/components/link";
import { useParams } from "next/navigation";
import CustomDropdown from "@/components/dropdown";
import { scheduleViewOption, scheduleViewType } from "@/constants/calendar";
import { Option } from "@/types/option";
import CustomDayline from "@/components/dayline";

const StreamerSchedulePage = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  const { today, week, dayArray, setPreMonth, setNextMonth, setPresentMonth } =
    useCalendar();

  const [selectedOption, setSelectedOption] = useState<Option>(
    scheduleViewOption[0]
  );

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-textLight py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">{id} 일정</p>
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
            <BrandButton
              classes="max-w-64 mr-2 md:w-auto"
              onClick={setPresentMonth}
            >
              오늘
            </BrandButton>
            <CustomDropdown
              option={scheduleViewOption}
              selected={selectedOption}
              setSelected={setSelectedOption}
            />
            <BrandLink href="/schedule/add" classes="w-full max-w-64 md:w-auto">
              <PlusIcon className="w-4 h-4 text-textMain mt-[0.5]" />
              일정 추가
            </BrandLink>
          </div>
        </div>
      </section>
      <section className="w-full">
        {selectedOption.value === scheduleViewType.calendar && (
          <CustomCalendar
            today={today}
            week={week}
            dayArray={dayArray}
            isHasSchedule={true}
            schedule={TestDayList}
          />
        )}
        {selectedOption.value === scheduleViewType.timeline && (
          <div className="w-full py-12">
            <CustomDayline schedule={TestDayList} />
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default StreamerSchedulePage;
