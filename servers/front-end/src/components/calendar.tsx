import { getRoute, route } from "@/lib/constants/router";
import {
  dateToFormatString,
  TDayjsType,
  getDateDiff,
  getToday,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface ICustomCalendar {
  today: TDayjsType;
  week: string[];
  dayArray: { [x: number]: TDayjsType[] }[];
  isHasSchedule?: boolean;
  scheduleList?: TMonthSchedule;
}

const streamWidth: { [x: number]: string } = {
  0: "w-full",
  1: "w-[calc(200%+1px)]",
  2: "w-[calc(300%+1px)]",
  3: "w-[calc(400%+1px)]",
  4: "w-[calc(500%+1px)]",
  5: "w-[calc(600%+1px)]",
  6: "w-[calc(700%+1px)]",
};

const streamTopMargin: { [x: number]: string } = {
  0: "mt-0",
  1: "mt-[22px]",
  2: "mt-[44px]",
  3: "mt-[66px]",
};

const colStart = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const colSpan = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
];

const rowStart = [
  "row-start-1",
  "row-start-2",
  "row-start-3",
  "row-start-4",
  "row-start-5",
  "row-start-6",
  "row-start-7",
];

const CustomCalendar = ({
  today,
  week,
  dayArray,
  isHasSchedule = false,
  scheduleList,
}: ICustomCalendar) => {
  scheduleList = isHasSchedule ? scheduleList : undefined;

  const pathName = usePathname();
  const etcLink = pathName.replace(route.calendar, route.timeline);

  // const getStreamClass = (
  //   dateDiff: number,
  //   preList: number,
  //   column: number
  // ) => {
  //   const index = dateDiff > 6 - column ? 6 - column : dateDiff;

  //   return [
  //     streamWidth[index],
  //     streamTopMargin[preList],
  //     "flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-textMain text-xs truncate",
  //   ].join(" ");
  // };
  const getStreamSpanClass = (dateDiff: number, column: number) => {
    const span = Math.min(dateDiff + 1, 7 - column);
    return `col-start-${column + 1} col-span-${span}`;
  };

  return (
    <div className="w-full mx-auto lg:max-w-6xl">
      <div className="box-border w-full border border-textLight border-y-0">
        <div className="grid grid-cols-7 divide-x divide-x-textLight">
          {week.map((item) => (
            <div
              key={item}
              className={clsx(
                "h-8 leading-8 text-center text-sm border-b border-textLight",
                {
                  "text-red-600": item === "일",
                  "text-blue-600": item === "토",
                  "text-textMain": item !== "일" && item !== "토",
                }
              )}
            >
              {item}
            </div>
          ))}
        </div>
        {dayArray.map((week, weekIdx) => (
          <div key={weekIdx} className="relative w-full">
            <div className="grid grid-cols-7 divide-x divide-x-textLight border-b border-textLight">
              {week[weekIdx].map((day, dayIdx) => {
                const dayStr = dateToFormatString(day, "YYYY-MM-DD");
                const todayStr = dateToFormatString(getToday(), "YYYY-MM-DD");

                const isToday = todayStr === dayStr;
                const isSameMonth =
                  dateToFormatString(today, "YYYY-MM") ===
                  dateToFormatString(day, "YYYY-MM");

                const dayClass = clsx(
                  "pl-1 py-1 text-left text-xs h-36",
                  isSameMonth ? "font-normal" : "font-light",
                  {
                    "text-red-600": isSameMonth && dayIdx === 0,
                    "text-blue-600": isSameMonth && dayIdx === 6,
                    "text-textMain":
                      isSameMonth && dayIdx !== 0 && dayIdx !== 6,
                    "text-textNormal": !isSameMonth,
                  }
                );

                return (
                  <div key={day.unix()} className={dayClass}>
                    {isToday ? (
                      <div className="flex items-center justify-center w-6 h-6 bg-brandMain rounded-full text-white">
                        {dateToFormatString(day, "D")}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                        {dateToFormatString(day, "D")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {isHasSchedule && scheduleList && (
              <div className="absolute top-8 left-0 right-0 z-10 grid grid-cols-7 gap-[2px]">
                {(() => {
                  const renderedIds = new Set(); // 한 주 내에서 이미 렌더링된 stream._id 추적
                  const rowCounter: Record<number, number> = {}; // 각 column에 대한 현재 row-start

                  return week[weekIdx].map((day, dayIdx) => {
                    const dayStr = dateToFormatString(day, "YYYY-MM-DD");
                    const daySchedule = scheduleList[dayStr]?.list ?? [];

                    return daySchedule
                      .filter((schedule) => {
                        if (renderedIds.has(schedule._id)) return false;

                        const start = dateToFormatString(
                          schedule.startAt,
                          "YYYY-MM-DD"
                        );
                        const end = dateToFormatString(
                          schedule.endAt,
                          "YYYY-MM-DD"
                        );

                        const isWithinWeek = start <= dayStr && dayStr <= end;

                        if (isWithinWeek) {
                          renderedIds.add(schedule._id);
                          return true;
                        }

                        return false;
                      })
                      .map((schedule) => {
                        const diff = getDateDiff(
                          schedule.endAt,
                          schedule.startAt,
                          "d"
                        );
                        const span = Math.min(diff + 1, 7 - dayIdx);

                        // 현재 column의 row count 증가
                        const row = (rowCounter[dayIdx] ?? 0) + 1;
                        rowCounter[dayIdx] = row;

                        return (
                          <Link
                            key={`${schedule._id}-${dayStr}`}
                            className={clsx(
                              colStart[dayIdx],
                              colSpan[span - 1],
                              rowStart[row],
                              "h-5 px-1 bg-white border border-brandMain rounded-md text-textMain text-xs truncate"
                            )}
                            href={getRoute(route.schedule, schedule._id)}
                          >
                            {schedule.title}
                          </Link>
                        );
                      });
                  });
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
