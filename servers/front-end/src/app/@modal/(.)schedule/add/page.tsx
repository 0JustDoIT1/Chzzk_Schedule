import { getAllStreamer } from "@/api/streamer-api";
import Modal from "@/components/modal";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import React from "react";

const ScheduleAddModal = async () => {
  const streamerList = await getAllStreamer();

  return (
    <Modal>
      <ScheduleAddView streamerList={streamerList} />
    </Modal>
  );
};

export default ScheduleAddModal;
