import Modal from "@/components/common/modal";
import ScheduleDetailView from "@/screens/schedule/scheduleDetail";

interface IDetailIdModalPage {
  params: { id: string };
}

const DetailIdModalPage = async ({ params }: IDetailIdModalPage) => {
  const { id } = await params;

  return (
    <Modal>
      <ScheduleDetailView id={id} />
    </Modal>
  );
};

export default DetailIdModalPage;
