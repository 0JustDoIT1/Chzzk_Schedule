import Modal from "@/components/common/modal";
import StreamingView from "@/screens/streaming";

interface IStreamingModalPage {
  params: { id: string };
}

const StreamingModalPage = async ({ params }: IStreamingModalPage) => {
  const { id } = await params;

  return (
    <Modal>
      <StreamingView id={id} />
    </Modal>
  );
};

export default StreamingModalPage;
