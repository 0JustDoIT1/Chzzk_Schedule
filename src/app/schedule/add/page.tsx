"use client";

import ScheduleEdit from "@/components/scheduleEdit";
import SearchableDropdown from "@/components/searchableDropdown";
import { useState } from "react";

const ScheduleAddPage = () => {
  const [value, setValue] = useState<string | null>("스트리머를 선택해 주세요");

  return (
    <main className="bg-white w-full flex flex-col items-center">
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-[1200px]">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">일정 추가</p>
            <p className="text-sm text-gray-500">
              원하는 스트리머의 방송 일정을 추가해 보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3 md:justify-end">
            <SearchableDropdown
              list={[
                { _id: 1, name: "hi" },
                { _id: 2, name: "test" },
                { _id: 3, name: "hi2" },
                { _id: 4, name: "test2" },
                { _id: 5, name: "hi3" },
                { _id: 6, name: "test3" },
                { _id: 7, name: "hi4" },
                { _id: 8, name: "test4" },
              ]}
              label="name"
              selectedVal={value}
              handleChange={setValue}
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <ScheduleEdit />
      </section>
    </main>
  );
};

export default ScheduleAddPage;
