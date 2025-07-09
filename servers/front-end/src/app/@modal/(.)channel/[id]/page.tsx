import Modal from "@/components/common/modal";
import ScheduleLinkView from "@/screens/schedule/scheduleChannel";

interface IChannelModalPage {
  params: { id: string };
}

const ChannelModalPage = async ({ params }: IChannelModalPage) => {
  const { id } = await params;

  return (
    <Modal>
      <ScheduleLinkView id={id} />
    </Modal>
  );
};

export default ChannelModalPage;
