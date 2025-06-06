import { getModalRoute, getRoute, route } from "@/constants/router";
import {
  dateToFormatString,
  TDayjsType,
  getDateDiff,
  getToday,
} from "@/utils/dateFormat";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ICustomCalendar {
  today: TDayjsType;
  week: string[];
  dayArray: { [x: number]: TDayjsType[] }[];
  isHasSchedule?: boolean;
  schedule?: any;
}

const CustomCalendar = ({
  today,
  week,
  dayArray,
  isHasSchedule = false,
  schedule,
}: ICustomCalendar) => {
  schedule = isHasSchedule ? schedule : null;

  const pathName = usePathname();
  const etcLink = pathName.replace(route.calendar, route.timeline);

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

  const streamText = (dateDiff: number, preList: number, column: number) => {
    const index = dateDiff > 6 - column ? 6 - column : dateDiff;

    return `${`${streamWidth[index]} ${streamTopMargin[preList]} flex items-center h-5 px-1 bg-white z-10 border border-brandMain rounded-md text-textMain text-xs truncate`}`;
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
              const todayCheck =
                dateToFormatString(getToday(), "YYYY-MM-DD") ===
                dateToFormatString(day, "YYYY-MM-DD");
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
                        schedule.map((item: any) => {
                          const dateCheck =
                            item.day === dateToFormatString(day, "YYYY-MM-DD");
                          const todayViewLength = 4 - item.preList.length;
                          const todayViewCheck = todayViewLength;

                          const etc =
                            item.list.length + item.preList.length - 4;
                          const etcCheck = dateCheck && etc;

                          return (
                            <React.Fragment key={item.day}>
                              {dateCheck &&
                                !column &&
                                item.preList.map((stream: any) => {
                                  const dateDiff = getDateDiff(
                                    stream.endAt,
                                    item.day,
                                    "day"
                                  );

                                  return (
                                    <Link
                                      key={stream.title}
                                      href={getModalRoute(
                                        getRoute(route.schedule, stream._id)
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
                                  .map((stream: any) => {
                                    const dateDiff = getDateDiff(
                                      stream.endAt,
                                      item.day,
                                      "day"
                                    );
                                    return (
                                      <Link
                                        key={stream.title}
                                        href={getModalRoute(
                                          getRoute(route.schedule, stream._id)
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
