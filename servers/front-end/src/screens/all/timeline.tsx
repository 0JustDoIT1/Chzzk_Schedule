"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React from "react";
import CustomDayline from "@/components/dayline";
import { queryKeys } from "@/lib/constants/react-query";
import { useQuery } from "@tanstack/react-query";
import { getScheduleListByMonth } from "@/api/schedule-api";
import IsLoading from "@/components/isLoading";
import IsError from "@/components/isError";

interface IAllTimelineView {
  date: Date;
}

const AllTimelineView = ({ date }: IAllTimelineView) => {
  const { today } = useCalendar();

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleListByMonth(date),
    queryFn: () => getScheduleListByMonth(date),
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return <>{isSuccess && <CustomDayline scheduleList={data} date={today} />}</>;
};

export default AllTimelineView;
