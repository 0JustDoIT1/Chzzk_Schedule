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
    <section className="border-b border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-textMain">일정 제보</h1>
        <p className="text-sm text-textNormal">방송 일정과 출처를 제보해 주세요. 공식 방송 여부는 관리자가 출처를 확인해 분류합니다.</p>
      </div>
    </section>
    <main className="min-h-[calc(100vh-180px)] bg-[#f7faf8] px-4 py-8 sm:px-6">
      {isSuccess && <ScheduleInput streamerList={data} isOfficial={isOfficial} setIsOfficial={setIsOfficial} />}
    </main>
  </>;
};

export default ScheduleAddView;
