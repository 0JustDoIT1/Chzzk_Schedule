import { getAllStreamer } from "@/api/streamer-api";
import Modal from "@/components/modal";
import { IStreamer } from "@/schemas/streamer.schema";
import ScheduleAddView from "@/screens/schedule/scheduleAdd";
import { isResError } from "@/utils/errorHandler";

const ScheduleAddModal = async () => {
  let data: IStreamer[];
  const streamerList = await getAllStreamer();
  if (isResError(streamerList)) data = [];
  else data = streamerList;

  return (
    <Modal>
      <ScheduleAddView streamerList={data} />
    </Modal>
  );
};

export default ScheduleAddModal;
