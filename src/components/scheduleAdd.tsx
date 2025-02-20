"use client";

import React from "react";
import SearchableDropdown from "./searchableDropdown";
import ScheduleInput from "./scheduleInput";

const ScheduleAdd = () => {
  return (
    <React.Fragment>
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-2xl">
          <div className="flex flex-col items-center w-full md:w-2/3 md:items-start">
            <p className="text-2xl">일정 추가</p>
            <p className="text-sm text-gray-500">
              원하는 스트리머의 방송 일정을 추가해 보세요.
            </p>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/3 md:justify-end">
            <SearchableDropdown
              list={[
                { _id: 1, name: "hi" },
                { _id: 2, name: "testㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ" },
                { _id: 3, name: "hi2" },
                { _id: 4, name: "test2" },
                { _id: 5, name: "hi3" },
                { _id: 6, name: "test3" },
                { _id: 7, name: "hi4" },
                { _id: 8, name: "test4" },
                { _id: 9, name: "hi5" },
                { _id: 10, name: "test5" },
                { _id: 11, name: "hi6" },
                { _id: 12, name: "test6" },
                { _id: 13, name: "hi7" },
                { _id: 14, name: "test7" },
                { _id: 15, name: "hi8" },
                { _id: 16, name: "test8" },
                { _id: 17, name: "hi9" },
                { _id: 18, name: "test9" },
                { _id: 19, name: "hi10" },
                { _id: 20, name: "test10" },
                { _id: 21, name: "hi11" },
                { _id: 22, name: "test11" },
                { _id: 23, name: "hi12" },
                { _id: 24, name: "test12" },
              ]}
              label="name"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <ScheduleInput />
      </section>
    </React.Fragment>
  );
};

export default ScheduleAdd;
