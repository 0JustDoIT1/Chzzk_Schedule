"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllStreamerList } from "@/api/streamer-api";
import ScheduleInput from "../../components/schedule/scheduleInput";
import IsLoading from "@/lib/components/layout/isLoading";
import IsError from "@/lib/components/layout/isError";
import { queryKeys } from "@/lib/constants/react-query";

const ScheduleAddView = () => {
  const [isOfficial, setIsOfficial] = useState(false);
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return <>
    <section className="w-full border-b border-b-textLight p-4">
      <div className="container mx-auto px-4 md:px-8 lg:max-w-2xl">
        <p className="text-2xl">일정 제보</p>
        <p className="text-sm text-textNormal">방송 일정과 출처를 제보해 주세요. 공식 방송 여부는 관리자가 출처를 확인해 분류합니다.</p>
      </div>
    </section>
    <main className="w-full p-4">
      {isSuccess && <ScheduleInput streamerList={data} isOfficial={isOfficial} setIsOfficial={setIsOfficial} />}
    </main>
  </>;
};

export default ScheduleAddView;
