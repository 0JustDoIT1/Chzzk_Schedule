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

const maxRenderCount = 4;

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
                  // 해당 날짜 셀 안에 row-start를 위한 위치 (row 겹침 방지)
                  const rowStack: Record<number, Set<number>> = {};

                  return week[weekIdx].map((day, dayIdx) => {
                    // 캘린더 별 날짜
                    const dayStr = dateToFormatString(day, "YYYY-MM-DD");
                    // 캘린더 날짜(셀) 별 일정
                    const daySchedule = scheduleList[dayStr]?.list ?? [];

                    // 날짜(셀) 별 etcCount
                    // 중복제거
                    const uniqueSchedules = Array.from(
                      new Map(daySchedule.map((s) => [s._id, s])).values()
                    );

                    let rendered = 0;
                    const maxRender = 4;

                    return (
                      <React.Fragment key={dayStr}>
                        {uniqueSchedules.map((schedule) => {
                          if (rendered >= maxRender) return null;

                          // 스케줄의 시작일과 종료일
                          const start = dateToFormatString(
                            schedule.startAt,
                            "YYYY-MM-DD"
                          );
                          const end = dateToFormatString(
                            schedule.endAt,
                            "YYYY-MM-DD"
                          );

                          // 해당 일정이 주(week)에 이미 속해진(렌더링된) 일정인지 체크
                          // 속해있다면 true, 아니라면 false
                          // start <= wDayStr <= end && wDayStr < dayStr
                          const isInWeek = week[weekIdx].some((wDay) => {
                            const wDayStr = dateToFormatString(
                              wDay,
                              "YYYY-MM-DD"
                            );
                            return (
                              wDayStr < dayStr &&
                              wDayStr >= start &&
                              wDayStr <= end
                            );
                          });
                          // 이미 속한 일정이라면 null로 그려지지 않음
                          if (isInWeek) return null;

                          rendered += 1;

                          // 일정 기간 계산
                          const diff = getDateDiff(
                            schedule.endAt,
                            schedule.startAt,
                            "d"
                          );
                          // 며칠짜리 span인지 계산
                          // why? diff+1 (ex. 월-수 => diff만은 2일이지만 span은 3일이어야 함)
                          // 주를 넘지 않게 처리하기 위해서 7 - 날짜index를 통해 최소값 비교
                          const span = Math.min(diff + 1, 7 - dayIdx);

                          // 현재 일정이 차지할 grid의 row 결정
                          // span이 되는 모든 column이 비어있어야 함
                          // 충돌(conflict)이 없을 때까지 row 증가시켜서 찾음
                          let row = 1;
                          while (true) {
                            // 현재 row가 다른 일정에 의해 차지되어 있는지 확인하는 flag
                            let conflict = false;
                            // 현재 row가 해당 span만큼 비어 있는지 확인
                            for (let i = 0; i < span; i++) {
                              const col = dayIdx + i;
                              if (rowStack[row]?.has(col)) {
                                conflict = true;
                                break;
                              }
                            }
                            if (!conflict) break;
                            row++;
                          }

                          // rowStack에 span 범위 차지하는 col 모두 마킹
                          for (let i = 0; i < span; i++) {
                            const col = dayIdx + i;
                            if (!rowStack[row]) rowStack[row] = new Set();
                            rowStack[row].add(col);
                          }

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
                        })}

                        {Math.max(uniqueSchedules.length - rendered, 0) > 0 && (
                          <Link
                            key={`etc-${dayStr}`}
                            href={`${etcLink}?date=${dayStr}`}
                            className={clsx(
                              colStart[dayIdx],
                              rowStart[
                                Math.max(
                                  ...Object.keys(rowStack).map(Number),
                                  0
                                ) + 1
                              ],
                              "flex items-center justify-center w-full h-5 px-1 bg-brandMain rounded-md text-white text-xs font-light truncate"
                            )}
                            scroll={false}
                          >
                            {Math.max(uniqueSchedules.length - rendered, 0)}개
                            더보기
                          </Link>
                        )}
                      </React.Fragment>
                    );
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
