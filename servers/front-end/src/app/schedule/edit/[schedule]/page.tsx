import ScheduleEditView from "@/lib/screens/schedule/scheduleEdit";
import React from "react";

interface IScheduleEditPage {
  params: { schedule: string };
}

const ScheduleEditPage = async ({ params }: IScheduleEditPage) => {
  const { schedule } = await params;

  return <ScheduleEditView id={schedule} />;
};

export default ScheduleEditPage;
