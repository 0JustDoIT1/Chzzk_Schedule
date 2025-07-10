import Modal from "@/lib/components/common/modal";
import ScheduleLinkView from "@/lib/screens/schedule/scheduleChannel";

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
