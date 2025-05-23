import { getAllStreamerList } from "@/api/streamer-api";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import React from "react";

const ScheduleAddPage = async () => {
  const streamerList = await getAllStreamerList();

  return <ScheduleAddView streamerList={streamerList} />;
};

export default ScheduleAddPage;
