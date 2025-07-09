import Modal from "@/components/common/modal";
import ScheduleLinkView from "@/screens/schedule/scheduleChannel";

interface IChannelPage {
  params: { id: string };
}

const ChannelPage = async ({ params }: IChannelPage) => {
  const { id } = await params;

  return (
    <Modal>
      <ScheduleLinkView id={id} />
    </Modal>
  );
};

export default ChannelPage;
