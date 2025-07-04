"use client";

import useCalendar from "@/lib/hook/useCalendar";
import { TestDayList } from "@/lib/constants/test";
import React, { useEffect } from "react";
import CustomCalendar from "@/components/calendar";

const AllCalendarView = () => {
  const { today, week, dayArray } = useCalendar();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <CustomCalendar
      today={today}
      week={week}
      dayArray={dayArray}
      isHasSchedule={true}
      schedule={TestDayList}
    />
  );
};

export default AllCalendarView;
