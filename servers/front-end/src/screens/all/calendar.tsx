"use client";

import useCalendar from "@/lib/hook/useCalendar";
import React, { useEffect } from "react";
import CustomCalendar from "@/components/calendar";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/react-query";
import { getScheduleListByMonth } from "@/api/schedule-api";
import IsLoading from "@/components/isLoading";
import IsError from "@/components/isError";

interface IAllCalendarView {
  date: Date;
}

const AllCalendarView = ({ date }: IAllCalendarView) => {
  const { today, week, dayArray } = useCalendar();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, []);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleListByMonth(date),
    queryFn: () => getScheduleListByMonth(date),
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <>
      {isSuccess && (
        <CustomCalendar
          today={today}
          week={week}
          dayArray={dayArray}
          isHasSchedule={true}
          schedule={data}
        />
      )}
    </>
  );
};

export default AllCalendarView;
