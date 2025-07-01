"use client";

import React, { useMemo, useState } from "react";
import ScheduleInput from "../../components/scheduleInput";
import { useQuery } from "@tanstack/react-query";
import IsLoading from "@/components/isLoading";
import IsError from "@/components/isError";
import { getScheduleById } from "@/api/schedule-api";
import { getAllStreamerList } from "@/api/streamer-api";
import { queryKeys } from "@/lib/constants/react-query";

interface IScheduleEditView {
  id: string;
}

const ScheduleEditView = ({ id }: IScheduleEditView) => {
  const {
    data: streamerData,
    isSuccess: streamerSuccess,
    isLoading: streamerLoading,
    isError: streamerError,
  } = useQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
  });

  const {
    data: scheduleData,
    isSuccess: scheduleSuccess,
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useQuery({
    queryKey: queryKeys.getScheduleById(id),
    queryFn: () => getScheduleById(id!),
    enabled: !!id,
  });

  const [isOfficial, setIsOfficial] = useState<boolean>(
    scheduleData?.isOfficial ?? false
  );

  // 데이터가 있을 때만 필터링 처리
  const filteredList = useMemo(() => {
    if (!streamerData) return [];
    return isOfficial
      ? streamerData
      : streamerData.filter((streamer) => !streamer.isOfficial);
  }, [streamerData, isOfficial]);

  const onChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsOfficial(checked);
  };

  if (streamerLoading || scheduleLoading) return <IsLoading />;
  if (streamerError || scheduleError) return <IsError />;

  return (
    <>
      <section className="w-full border-b border-b-textLight p-4">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 수정</p>
            <p className="text-sm text-textNormal">
              원하는 스트리머의 방송 일정을 수정해 보세요.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 md:items-end">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isOfficial}
                onChange={onChangeToggle}
              />
              <div className="relative w-11 h-6 bg-textSuperLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-textLight after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brandMain peer-focus:ring-2 peer-focus:ring-double peer-focus:ring-brandLight"></div>
              <span className="mx-3 text-sm text-textMain mt-[2px]">
                치지직 공식
              </span>
            </label>
          </div>
        </div>
      </section>
      <main className="w-full p-4">
        {streamerSuccess && scheduleSuccess && (
          <ScheduleInput
            streamerList={filteredList}
            isOfficial={isOfficial}
            setIsOfficial={setIsOfficial}
            initData={scheduleData}
          />
        )}
      </main>
    </>
  );
};

export default ScheduleEditView;
