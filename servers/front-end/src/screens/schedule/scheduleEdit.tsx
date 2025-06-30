"use client";

import React, { useMemo, useState } from "react";
import ScheduleInput from "../../components/scheduleInput";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import IsLoading from "@/components/isLoading";
import IsError from "@/components/isError";
import { getScheduleById } from "@/api/schedule-api";
import { getAllStreamerList } from "@/api/streamer-api";

const ScheduleEditView = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("schedule");
  const [isOfficial, setIsOfficial] = useState<boolean>(false);

  const {
    data: streamerData,
    isSuccess: streamerSuccess,
    isLoading: streamerLoading,
    isError: streamerError,
  } = useQuery({
    queryKey: ["getAllStreamerList"],
    queryFn: getAllStreamerList,
  });

  const {
    data: scheduleData,
    isSuccess: scheduleSuccess,
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useQuery({
    queryKey: ["getScheduleById", id],
    queryFn: () => getScheduleById(id!),
    enabled: !!id,
  });

  // 데이터가 있을 때만 필터링 처리
  const filteredList = useMemo(() => {
    if (!streamerData) return [];
    return isOfficial
      ? streamerData
      : streamerData.filter((streamer) => !streamer.isOfficial);
  }, [streamerData, isOfficial]);

  if (streamerLoading || scheduleLoading) return <IsLoading />;
  if (streamerError || scheduleError) return <IsError />;

  return (
    <>
      <section className="w-full border-b border-b-textLight p-4">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 수정</p>
          </div>
        </div>
      </section>
      <main className="w-full p-4">
        {streamerSuccess && scheduleSuccess && (
          <ScheduleInput
            streamerList={filteredList}
            isOfficial={isOfficial}
            setIsOfficial={setIsOfficial}
            // initData={TestScheduleData}
          />
        )}
      </main>
    </>
  );
};

export default ScheduleEditView;
