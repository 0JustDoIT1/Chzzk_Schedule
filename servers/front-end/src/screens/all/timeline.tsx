"use client";

import useCalendar from "@/lib/hook/useCalendar";
import { TestDayList } from "@/lib/constants/test";
import React from "react";
import CustomDayline from "@/components/dayline";

const AllTimelineView = () => {
  const { today } = useCalendar();

  return <CustomDayline schedule={TestDayList} date={today} />;
};

export default AllTimelineView;
