"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React, { useEffect } from "react";
import CustomCalendar from "@/components/calendar/calendar";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/react-query";
import {
  getOfficialScheduleListByMonth,
  getScheduleListByMonth,
  getScheduleListByMonthWithId,
} from "@/api/schedule-api";
import IsLoading from "@/components/layout/isLoading";
import IsError from "@/components/layout/isError";

interface ICalendarView {
  date: Date;
  id?: string;
  isOfficial?: boolean;
}

const CalendarView = ({ date, id, isOfficial }: ICalendarView) => {
  const { today, weekHeader, dayArray } = useCalendar();

  console.log("###", id);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  const fetchSchedule = (date: Date, id?: string, isOfficial?: boolean) => {
    if (isOfficial) return getOfficialScheduleListByMonth(date);
    if (id) return getScheduleListByMonthWithId(date, id);
    return getScheduleListByMonth(date);
  };

  const getQueryKey = (date: Date, id?: string, isOfficial?: boolean) => {
    if (isOfficial) return queryKeys.getOfficialScheduleListByMonth(date);
    if (id) return queryKeys.getScheduleListByMonthWithId(date, id);
    return queryKeys.getScheduleListByMonth(date);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: getQueryKey(date, id, isOfficial),
    queryFn: () => fetchSchedule(date, id, isOfficial),
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
