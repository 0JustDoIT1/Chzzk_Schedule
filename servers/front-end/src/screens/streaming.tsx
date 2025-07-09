"use client";

import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";

interface IStreamingView {
  id: string;
}

const StreamingView = ({ id }: IStreamingView) => {
  return (
    <section className="w-full p-4">
      <div className="flex items-center">
        {id}
        <p>채널 보기</p>
        <p>
          <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain" />
        </p>
      </div>
    </section>
  );
};

export default StreamingView;
