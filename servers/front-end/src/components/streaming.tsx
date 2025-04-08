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
        <p>채널 보기</p>
        <p>
          <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain mt-[0.5]" />
        </p>
      </div>
    </main>
  );
};

export default Streaming;
