import Modal from "@/components/modal";
import ScheduleDetailView from "@/screens/schedule/scheduleDetail";

interface ITodayIdModalPage {
  params: { id: string };
}

const TodayIdModalPage = async ({ params }: ITodayIdModalPage) => {
  const { id } = await params;

  return (
    <Modal>
      <ScheduleDetailView id={id} />
    </Modal>
  );
};

export default TodayIdModalPage;
