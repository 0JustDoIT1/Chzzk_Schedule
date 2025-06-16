"use client";

import React, { useMemo, useState } from "react";
import ScheduleInput from "../../components/scheduleInput";
import { useQuery } from "@tanstack/react-query";
import { getAllStreamerList } from "@/api/streamer-api";

const ScheduleAddView = () => {
  const [isOfficial, setIsOfficial] = useState<boolean>(false);

  const onChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsOfficial(checked);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["getAllStreamerList"],
    queryFn: getAllStreamerList,
  });

  // 데이터가 있을 때만 필터링 처리
  const filteredList = useMemo(() => {
    if (!data) return [];
    return isOfficial ? data : data.filter((streamer) => !streamer.isOfficial);
  }, [data, isOfficial]);

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-textLight p-4">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 추가</p>
            <p className="text-sm text-textNormal">
              원하는 스트리머의 방송 일정을 추가해 보세요.
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
        {isSuccess && (
          <ScheduleInput
            streamerList={filteredList}
            isOfficial={isOfficial}
            setIsOfficial={setIsOfficial}
          />
        )}
      </main>
    </React.Fragment>
  );
};

export default ScheduleAddView;
