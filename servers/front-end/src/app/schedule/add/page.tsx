import { getAllStreamer } from "@/api/streamer-api";
import { IStreamer } from "@/schemas/streamer.schema";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import { isResError } from "@/utils/errorHandler";
import React from "react";

const ScheduleAddPage = async () => {
  let data: IStreamer[];
  const streamerList = await getAllStreamer();
  if (isResError(streamerList)) data = [];
  else data = streamerList;

  return <ScheduleAddView streamerList={data} />;
};

export default ScheduleAddPage;
