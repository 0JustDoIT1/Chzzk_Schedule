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
                  const renderedIds = new Set(); // 💡 한 주 내에서 이미 렌더링된 stream._id 추적

                  return week[weekIdx].flatMap((day, dayIdx) => {
                    const dayStr = dateToFormatString(day, "YYYY-MM-DD");
                    const daySchedule = scheduleList[dayStr]?.list ?? [];

                    return daySchedule
                      .filter((stream) => {
                        if (renderedIds.has(stream._id)) return false;

                        const start = dateToFormatString(
                          stream.startAt,
                          "YYYY-MM-DD"
                        );
                        const end = dateToFormatString(
                          stream.endAt,
                          "YYYY-MM-DD"
                        );

                        const isWithinWeek = start <= dayStr && dayStr <= end;

                        if (isWithinWeek) {
                          renderedIds.add(stream._id);
                          return true;
                        }

                        return false;
                      })
                      .map((stream) => {
                        const diff = getDateDiff(
                          stream.endAt,
                          stream.startAt,
                          "d"
                        );
                        const span = Math.min(diff + 1, 7 - dayIdx);

                        return (
                          <div
                            key={`${stream._id}-${dayStr}`}
                            className={clsx(
                              colStart[dayIdx],
                              colSpan[span - 1],
                              "h-5 px-1 bg-white border border-brandMain rounded-md text-textMain text-xs truncate"
                            )}
                          >
                            <Link href={getRoute(route.schedule, stream._id)}>
                              {stream.title}
                            </Link>
                          </div>
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

// import {
//   dateToFormatString,
//   getDateDiff,
//   getToday,
//   getDayjs,
//   isSameDate,
//   isAfterDate,
//   isBeforeDate,
// } from "@/lib/utils/dateFormat";
// import { getRoute, route } from "@/lib/constants/router";
// import { TDayjsType } from "@/lib/utils/dateFormat";
// import { TMonthSchedule } from "@/schemas/schedule.schema";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// interface ICustomCalendar {
//   today: TDayjsType;
//   week: string[];
//   dayArray: { [x: number]: TDayjsType[] }[];
//   isHasSchedule?: boolean;
//   schedule?: TMonthSchedule;
// }

// const streamWidth: { [x: number]: string } = {
//   0: "w-full",
//   1: "w-[calc(200%+1px)]",
//   2: "w-[calc(300%+1px)]",
//   3: "w-[calc(400%+1px)]",
//   4: "w-[calc(500%+1px)]",
//   5: "w-[calc(600%+1px)]",
//   6: "w-[calc(700%+1px)]",
// };

// const streamTopMargin: { [x: number]: string } = {
//   0: "mt-0",
//   1: "mt-[22px]",
//   2: "mt-[44px]",
//   3: "mt-[66px]",
// };

// const CustomCalendar = ({
//   today,
//   week,
//   dayArray,
//   isHasSchedule = false,
//   schedule,
// }: ICustomCalendar) => {
//   const pathName = usePathname();
//   const etcLink = pathName.replace(route.calendar, route.timeline);
//   schedule = isHasSchedule ? schedule : undefined;

//   const renderPreList = (dayStr: string, column: number) => {
//     return schedule?.flatMap((item) => {
//       if (item.day !== dayStr) return [];
//       return item.preList
//         .filter((stream) => {
//           const streamStart = getDayjs(stream.startAt);
//           const streamEnd = getDayjs(stream.endAt);
//           const current = getDayjs(item.day);
//           const isAfterOrSameStart =
//             isSameDate(current, streamStart) ||
//             isAfterDate(current, streamStart);

//           const isBeforeOrSameEnd =
//             isSameDate(current, streamEnd) || isBeforeDate(current, streamEnd);

//           return (
//             isAfterOrSameStart && isBeforeOrSameEnd && current.day() === column
//           );
//         })
//         .map((stream) => {
//           const current = getDayjs(item.day);
//           const streamEnd = getDayjs(stream.endAt);

//           // 한 주 안에서 최대 span 계산
//           let span = 1;
//           for (let i = 1; i < 7 - column; i++) {
//             if (current.add(i, "day").isAfter(streamEnd, "date")) break;
//             span++;
//           }

//           const className = [
//             `w-[calc(${span * 100}%+${span - 1}px)]`,
//             streamTopMargin[0],
//             "flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-textMain text-xs truncate",
//           ].join(" ");

//           return (
//             <Link
//               key={`pre-${stream._id}-${dayStr}`}
//               href={getRoute(route.schedule, stream._id)}
//               className={className}
//               scroll={false}
//             >
//               {stream.title}
//             </Link>
//           );
//         });
//     });
//   };

//   return (
//     <div className="w-full mx-auto lg:max-w-6xl">
//       <div className="box-border w-full border border-textLight border-t-0 divide-y divide-y-textLight md:border-l-0">
//         <div className="grid grid-cols-7 divide-x divide-x-textLight">
//           {week.map((item) => (
//             <div
//               key={item}
//               className={`h-8 leading-8 text-center text-sm ${
//                 item === "일"
//                   ? "text-red-600"
//                   : item === "토"
//                   ? "text-blue-600"
//                   : "text-textMain"
//               }`}
//             >
//               {item}
//             </div>
//           ))}
//         </div>
//         {dayArray.map((week, row) => (
//           <div
//             key={row}
//             className="grid grid-cols-7 divide-x divide-x-textLight"
//           >
//             {week[row].map((day, column) => {
//               const dayStr = dateToFormatString(day, "YYYY-MM-DD");
//               const todayStr = dateToFormatString(getToday(), "YYYY-MM-DD");
//               const isToday = todayStr === dayStr;
//               const isSameMonth =
//                 dateToFormatString(today, "YYYY-MM") ===
//                 dateToFormatString(day, "YYYY-MM");

//               const dateSchedule = schedule?.find(
//                 (item) => item.day === dayStr
//               );
//               const list = dateSchedule?.list || [];
//               const preListCount = dateSchedule?.preList.length || 0;
//               const todayViewLength = 4 - preListCount;
//               const moreCount = list.length + preListCount - 4;

//               return (
//                 <div key={day.unix()} className="relative h-36">
//                   <div
//                     className={`pl-1 py-1 text-left text-xs ${
//                       isSameMonth ? "font-normal" : "font-light"
//                     } ${
//                       isSameMonth && !column
//                         ? "text-red-600"
//                         : isSameMonth && column === 6
//                         ? "text-blue-600"
//                         : isSameMonth
//                         ? "text-textMain"
//                         : "text-textNormal"
//                     }`}
//                   >
//                     {isToday ? (
//                       <div className="flex items-center justify-center w-6 h-6 bg-brandMain rounded-full text-white">
//                         {dateToFormatString(day, "D")}
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
//                         {dateToFormatString(day, "D")}
//                       </div>
//                     )}
//                   </div>

//                   {isHasSchedule && (
//                     <div className="w-full flex flex-col gap-[2px]">
//                       {renderPreList(dayStr, column)}

//                       {list.slice(0, todayViewLength).map((stream, i) => {
//                         const dateDiff = getDateDiff(
//                           stream.endAt,
//                           dayStr,
//                           "day"
//                         );
//                         const className = [
//                           streamWidth[
//                             dateDiff > 6 - column ? 6 - column : dateDiff
//                           ],
//                           streamTopMargin[preListCount + i] || "",
//                           "flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-textMain text-xs truncate",
//                         ].join(" ");

//                         return (
//                           <Link
//                             key={`list-${stream._id}-${dayStr}`}
//                             href={getRoute(route.schedule, stream._id)}
//                             className={className}
//                             scroll={false}
//                           >
//                             {stream.title}
//                           </Link>
//                         );
//                       })}

//                       {moreCount > 0 && (
//                         <Link
//                           href={`${etcLink}?date=${dayStr}`}
//                           className="flex items-center justify-center w-full h-5 px-1 bg-brandMain rounded-md text-white text-xs font-light truncate"
//                           scroll={false}
//                         >
//                           {moreCount}개 더보기
//                         </Link>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CustomCalendar;
