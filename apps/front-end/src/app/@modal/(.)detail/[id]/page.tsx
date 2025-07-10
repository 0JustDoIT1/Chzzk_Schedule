import Modal from "@/lib/components/common/modal";
import ScheduleDetailView from "@/lib/screens/schedule/scheduleDetail";

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
