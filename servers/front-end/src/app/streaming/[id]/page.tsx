import Modal from "@/components/common/modal";
import StreamingView from "@/screens/streaming";

interface IStreamingPage {
  params: { id: string };
}

const StreamingPage = async ({ params }: IStreamingPage) => {
  const { id } = await params;

  return (
    <Modal>
      <StreamingView id={id} />
    </Modal>
  );
};

export default StreamingPage;
