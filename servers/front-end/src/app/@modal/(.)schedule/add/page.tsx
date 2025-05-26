import Modal from "@/components/modal";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import React from "react";

const ScheduleAddModal = async () => {
  return (
    <Modal>
      <ScheduleAddView />
    </Modal>
  );
};

export default ScheduleAddModal;
