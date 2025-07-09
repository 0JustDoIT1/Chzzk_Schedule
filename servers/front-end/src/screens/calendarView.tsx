"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React, { useEffect } from "react";
import CustomCalendar from "@/components/calendar/calendar";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/react-query";
import { getScheduleListByMonth } from "@/api/schedule-api";
import IsLoading from "@/components/layout/isLoading";
import IsError from "@/components/layout/isError";

interface ICalendarView {
  date: Date;
}

const CalendarView = ({ date }: ICalendarView) => {
  const { today, weekHeader, dayArray } = useCalendar();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleListByMonth(date),
    queryFn: () => getScheduleListByMonth(date),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <>
      {isSuccess && (
        <CustomCalendar
          today={today}
          weekHeader={weekHeader}
          dayArray={dayArray}
          isHasSchedule={true}
          scheduleList={data}
        />
      )}
    </>
  );
};

export default CalendarView;
