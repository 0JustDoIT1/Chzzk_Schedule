"use client";

import { useParams } from "next/navigation";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";

const Streaming = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  return (
    <main className="w-full p-4">
      <div className="flex items-center">
        {id}
        <span>채널 보기</span>
        <span>
          <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain mt-[0.5]" />
        </span>
      </div>
    </main>
  );
};

export default Streaming;
