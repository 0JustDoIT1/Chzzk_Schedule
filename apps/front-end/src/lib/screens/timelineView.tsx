"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React from "react";
import CustomDayline from "@/lib/components/timeline/dayline";
import { queryKeys } from "@/lib/constants/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  getOfficialScheduleListByMonth,
  getScheduleListByMonth,
  getScheduleListByMonthWithId,
} from "@/api/schedule-api";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";

interface ITimelineView {
  date: Date;
  id?: string;
  isOfficial?: boolean;
}

const TimelineView = ({ date, id, isOfficial }: ITimelineView) => {
  const { today } = useCalendar();

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

  return <>{isSuccess && <CustomDayline scheduleList={data} date={today} />}</>;
};

export default TimelineView;
