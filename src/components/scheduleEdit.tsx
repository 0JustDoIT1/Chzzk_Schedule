"use client";

import React, { useState } from "react";
import ScheduleInput from "./scheduleInput";
import { useSearchParams } from "next/navigation";

const ScheduleEdit = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("schedule");
  const [isOfficial, setIsOfficial] = useState<boolean>(false);

  const onChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsOfficial(checked);
  };

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-textLight p-4">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 수정</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 md:items-end">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isOfficial}
                onChange={onChangeToggle}
              />
              <span className="mx-3 text-sm text-textMain mt-[2px]">
                치지직 공식
              </span>
              <div className="relative w-11 h-6 bg-textSuperLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-textLight after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brandMain peer-focus:ring-2 peer-focus:ring-double peer-focus:ring-brandLight"></div>
            </label>
          </div>
        </div>
      </section>
      <main className="w-full p-4">
        <ScheduleInput isOfficial={isOfficial} setIsOfficial={setIsOfficial} />
      </main>
    </React.Fragment>
  );
};

export default ScheduleEdit;
