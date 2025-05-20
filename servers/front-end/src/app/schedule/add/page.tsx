import { _getAllStreamer } from "@/api/streamer-api";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import React from "react";

const ScheduleAddPage = async () => {
  const data = await _getAllStreamer();

  return <ScheduleAddView streamerList={data} />;
};

export default ScheduleAddPage;
