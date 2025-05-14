"use client";

import React, { useState } from "react";
import ScheduleInput from "../../components/scheduleInput";
import { useSearchParams } from "next/navigation";

const ScheduleEditView = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("schedule");
  const [isOfficial, setIsOfficial] = useState<boolean>(false);

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-textLight p-4">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 수정</p>
          </div>
        </div>
      </section>
      <main className="w-full p-4">
        <ScheduleInput
          isOfficial={isOfficial}
          setIsOfficial={setIsOfficial}
          // initData={TestScheduleData}
        />
      </main>
    </React.Fragment>
  );
};

export default ScheduleEditView;
