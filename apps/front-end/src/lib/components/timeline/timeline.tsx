import clsx from "clsx";
import TimelineItem from "./timelineItem";
import { IDateSchedule } from "@shared/types";
import { dateToFormatString, getToday } from "@shared/utils";

interface ICustomTimeLine {
  schedule: IDateSchedule;
}

const CustomTimeline = ({ schedule }: ICustomTimeLine) => {
  const today = getToday();
  const currentHour = dateToFormatString(today, "HH");

  const sortedScheduleEntries = Object.entries(schedule).sort(([a], [b]) => {
    if (a === "미정") return -1;
    if (b === "미정") return 1;
    return parseInt(a) - parseInt(b);
  });

  if (sortedScheduleEntries.length === 0)
    return (
      <div className="container flex justify-center items-center py-32 mx-auto md:pl-12 lg:max-w-6xl">
        <p className="text-xl text-textNormal">오늘 방송 일정이 없습니다.</p>
      </div>
    );

  return (
    <div className="container mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative md:border-l-2 md:border-brandMain">
        {sortedScheduleEntries.map(([key, hourSchedule]) => {
          const isCurrentHour = currentHour === key;

          const timeCircleStyle = clsx(
            "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 -start-6 md:flex",
            isCurrentHour
              ? "border-brandMain bg-brandMain"
              : "border-brandMain bg-white"
          );

          const circleTextStyle = clsx(
            "mt-[1px] text-base font-bold",
            isCurrentHour ? "text-white" : "text-textNormal"
          );

          const timeText = (
            <p className={circleTextStyle}>
              {key}
              {key !== "미정" && (
                <span className="text-xs font-normal">시</span>
              )}
            </p>
          );

          return (
            <li key={key} className="mb-16 mx-8 md:ml-12 md:mr-8">
              <div className={timeCircleStyle}>{timeText}</div>
              {hourSchedule.map((schedule) => (
                <TimelineItem
                  key={schedule._id}
                  schedule={schedule}
                  today={today}
                />
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CustomTimeline;
