import {
  dateToFormatString,
  TDayjsType,
  getToday,
} from "@/lib/utils/dateFormat";
import { useEffect, useMemo } from "react";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import clsx from "clsx";
import DaylineItem from "./daylineItem";
import { SESSION_STORAGE_KEY } from "@/lib/constants/sessionStorage";
import { usePathname } from "next/navigation";

interface ICustomDayLine {
  scheduleList: TMonthSchedule;
  date: TDayjsType;
}

const CustomDayline = ({ scheduleList, date }: ICustomDayLine) => {
  const pathname = usePathname();
  const dateString = dateToFormatString(date, "YYYY-MM-DD");
  const scheduleArr = useMemo(
    () =>
      Object.entries(scheduleList).map(([date, { list }]) => ({
        date,
        list,
      })),
    [scheduleList]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedScroll = sessionStorage.getItem(
      SESSION_STORAGE_KEY.DAYLINE_SCROLL
    );

    if (savedScroll !== null) {
      window.scrollTo({ top: Number(savedScroll), behavior: "auto" });
      sessionStorage.removeItem(SESSION_STORAGE_KEY.DAYLINE_SCROLL);
      return;
    }

    // fallback scroll to target
    const element = document.getElementById(dateString);
    const offset = element?.getBoundingClientRect().top ?? 0;

    window.scroll({
      top: offset ? window.scrollY + offset - 82 : 0,
      behavior: "smooth",
    });
  }, [dateString, pathname]);

  if (scheduleArr.length === 0)
    return (
      <div className="container flex justify-center items-center py-32 mx-auto md:pl-12 lg:max-w-6xl">
        <p className="text-xl text-textNormal">이번 달 방송 일정이 없습니다.</p>
      </div>
    );

  return (
    <div className="w-full mt-12 mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative ml-12 border-l-2 border-brandMain md:ml-0">
        {scheduleArr.map((schedule) => {
          const daySchedule = schedule.list;
          const isToday =
            dateToFormatString(getToday(), "YYYY-MM-DD") === schedule.date;
          const isTarget = dateString === schedule.date;

          const circleWrapperClassName = clsx(
            "flex absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 -start-6",
            {
              "bg-brandMain border-brandMain": isTarget,
              "bg-white border-brandMain": !isTarget,
            }
          );

          const circleTextClassName = clsx("mt-[1px] text-base font-bold", {
            "text-white": isTarget,
            "text-textNormal": !isTarget,
          });

          return (
            <li
              key={schedule.date}
              id={schedule.date}
              className="mb-16 ml-12 mr-8 md:mr-0"
            >
              <div className={circleWrapperClassName}>
                <p className={circleTextClassName}>
                  {dateToFormatString(schedule.date, "DD")}
                </p>
                <p className="absolute top-12 py-1 text-center bg-white text-sm text-brandMain">
                  {dateToFormatString(schedule.date, "dddd")}
                </p>
              </div>
              {daySchedule.map((item) => (
                <DaylineItem key={item._id} item={item} isToday={isToday} />
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CustomDayline;
