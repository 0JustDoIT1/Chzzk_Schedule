import { getAllStreamer } from "@/api/streamer-api";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import React from "react";

const ScheduleAddPage = async () => {
  const streamerList = await getAllStreamer();

  return <ScheduleAddView streamerList={streamerList} />;
};

export default ScheduleAddPage;
