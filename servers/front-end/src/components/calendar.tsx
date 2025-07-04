import { getRoute, route } from "@/lib/constants/router";
import {
  dateToFormatString,
  TDayjsType,
  getDateDiff,
  getToday,
} from "@/lib/utils/dateFormat";
import { IMonthSchedule } from "@/schemas/schedule.schema";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface ICustomCalendar {
  today: TDayjsType;
  week: string[];
  dayArray: { [x: number]: TDayjsType[] }[];
  isHasSchedule?: boolean;
  schedule?: IMonthSchedule;
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

const CustomCalendar = ({
  today,
  week,
  dayArray,
  isHasSchedule = false,
  schedule,
}: ICustomCalendar) => {
  schedule = isHasSchedule ? schedule : undefined;

  const pathName = usePathname();
  const etcLink = pathName.replace(route.calendar, route.timeline);

  const streamText = (dateDiff: number, preList: number, column: number) => {
    const index = dateDiff > 6 - column ? 6 - column : dateDiff;

    return [
      streamWidth[index],
      streamTopMargin[preList],
      "flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-textMain text-xs truncate",
    ].join(" ");
  };

  return (
    <div className="w-full mx-auto lg:max-w-6xl">
      <div className="box-border w-full border border-textLight border-t-0 divide-y divide-y-textLight md:border-l-0">
        <div className="grid grid-cols-7 divide-x divide-x-textLight">
          {week.map((item) => (
            <div
              key={item}
              className={`h-8 leading-8 text-center text-sm ${
                item === "일"
                  ? "text-red-600"
                  : item === "토"
                  ? "text-blue-600"
                  : "text-textMain"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        {dayArray.map((week, row) => (
          <div
            key={row}
            className="grid grid-cols-7 divide-x divide-x-textLight"
          >
            {week[row].map((day, column) => {
              const dayStr = dateToFormatString(day, "YYYY-MM-DD");
              const todayStr = dateToFormatString(getToday(), "YYYY-MM-DD");

              const todayCheck = todayStr === dayStr;
              const monthCheck =
                dateToFormatString(today, "YYYY-MM") ===
                dateToFormatString(day, "YYYY-MM");

              return (
                <div key={day.unix()} className="relative h-36">
                  <div
                    className={`pl-1 py-1 text-left text-xs ${
                      monthCheck ? "font-normal" : "font-light"
                    } ${
                      monthCheck && !column
                        ? "text-red-600"
                        : monthCheck && column === 6
                        ? "text-blue-600"
                        : monthCheck
                        ? "text-textMain"
                        : "text-textNormal"
                    }`}
                  >
                    {todayCheck ? (
                      <div className="flex items-center justify-center w-6 h-6 bg-brandMain rounded-full text-white">
                        {dateToFormatString(day, "D")}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                        {dateToFormatString(day, "D")}
                      </div>
                    )}
                  </div>
                  {isHasSchedule && (
                    <div className="w-full flex flex-col gap-[2px]">
                      {schedule &&
                        schedule.map((item) => {
                          const dateCheck = item.day === dayStr;
                          const todayViewLength = 4 - item.preList.length;
                          const todayViewCheck = todayViewLength;

                          const etc =
                            item.list.length + item.preList.length - 4;
                          const etcCheck = dateCheck && etc;

                          return (
                            <React.Fragment key={item.day}>
                              {dateCheck &&
                                !column &&
                                item.preList.map((stream) => {
                                  const dateDiff = getDateDiff(
                                    stream.endAt,
                                    item.day,
                                    "day"
                                  );

                                  return (
                                    <Link
                                      key={stream.title}
                                      href={getRoute(
                                        route.schedule,
                                        stream._id
                                      )}
                                      className={streamText(dateDiff, 0, 0)}
                                    >
                                      {stream.title}
                                    </Link>
                                  );
                                })}
                              {dateCheck &&
                                todayViewCheck &&
                                item.list
                                  .slice(0, todayViewLength)
                                  .map((stream) => {
                                    const dateDiff = getDateDiff(
                                      stream.endAt,
                                      item.day,
                                      "day"
                                    );
                                    return (
                                      <Link
                                        key={stream.title}
                                        href={getRoute(
                                          route.schedule,
                                          stream._id
                                        )}
                                        className={streamText(
                                          dateDiff,
                                          item.preList.length,
                                          column
                                        )}
                                        scroll={false}
                                      >
                                        {stream.title}
                                      </Link>
                                    );
                                  })}
                              {etcCheck && (
                                <Link
                                  href={`${etcLink}?date=${dateToFormatString(
                                    day,
                                    "YYYY-MM-DD"
                                  )}`}
                                  className="flex items-center justify-center w-full h-5 px-1 bg-brandMain rounded-md text-white text-xs font-light truncate"
                                  scroll={false}
                                >
                                  {etc}개 더보기
                                </Link>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
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
// import { IMonthSchedule } from "@/schemas/schedule.schema";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// interface ICustomCalendar {
//   today: TDayjsType;
//   week: string[];
//   dayArray: { [x: number]: TDayjsType[] }[];
//   isHasSchedule?: boolean;
//   schedule?: IMonthSchedule;
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
//               const todayCheck = todayStr === dayStr;
//               const monthCheck =
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
//                       monthCheck ? "font-normal" : "font-light"
//                     } ${
//                       monthCheck && !column
//                         ? "text-red-600"
//                         : monthCheck && column === 6
//                         ? "text-blue-600"
//                         : monthCheck
//                         ? "text-textMain"
//                         : "text-textNormal"
//                     }`}
//                   >
//                     {todayCheck ? (
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
