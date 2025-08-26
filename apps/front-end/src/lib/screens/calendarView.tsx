"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React, { useEffect } from "react";
import CustomCalendar from "@/lib/components/calendar/calendar";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/react-query";
import {
  getOfficialScheduleListByMonth,
  getScheduleListByMonth,
  getScheduleListByMonthWithName,
} from "@/api/schedule-api";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";

interface ICalendarView {
  date: Date;
  name?: string;
  isOfficial?: boolean;
}

const CalendarView = ({ date, name, isOfficial }: ICalendarView) => {
  const { today, weekHeader, dayArray } = useCalendar();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  const fetchSchedule = (date: Date, name?: string, isOfficial?: boolean) => {
    if (isOfficial) return getOfficialScheduleListByMonth(date);
    if (name) return getScheduleListByMonthWithName(date, name);
    return getScheduleListByMonth(date);
  };

  const getQueryKey = (date: Date, name?: string, isOfficial?: boolean) => {
    if (isOfficial) return queryKeys.getOfficialScheduleListByMonth(date);
    if (name) return queryKeys.getScheduleListByMonthWithName(date, name);
    return queryKeys.getScheduleListByMonth(date);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: getQueryKey(date, name, isOfficial),
    queryFn: () => fetchSchedule(date, name, isOfficial),
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
