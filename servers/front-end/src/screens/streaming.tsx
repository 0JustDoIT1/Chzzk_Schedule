import { useParams } from "next/navigation";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";

const StreamingView = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  return (
    <section className="w-full p-4">
      <div className="flex items-center">
        {id}
        <p>채널 보기</p>
        <p>
          <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain mt-[0.5]" />
        </p>
      </div>
    </section>
  );
};

export default StreamingView;
