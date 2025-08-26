"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React from "react";
import CustomDayline from "@/lib/components/timeline/dayline";
import { queryKeys } from "@/lib/constants/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  getOfficialScheduleListByMonth,
  getScheduleListByMonth,
  getScheduleListByMonthWithName,
} from "@/api/schedule-api";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";

interface ITimelineView {
  date: Date;
  name?: string;
  isOfficial?: boolean;
}

const TimelineView = ({ date, name, isOfficial }: ITimelineView) => {
  const { today } = useCalendar();

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

  return <>{isSuccess && <CustomDayline scheduleList={data} date={today} />}</>;
};

export default TimelineView;
