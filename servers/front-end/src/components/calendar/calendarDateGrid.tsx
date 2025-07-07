import {
  dateToFormatString,
  getToday,
  TDayjsType,
} from "@/lib/utils/dateFormat";
import clsx from "clsx";

interface ICalendarDateGrid {
  week: {
    [x: number]: TDayjsType[];
  };
  weekIdx: number;
  today: TDayjsType;
}

const CalendarDateGrid = ({ week, weekIdx, today }: ICalendarDateGrid) => {
  // 여기서 today는 정말 오늘을 의미
  const todayStr = dateToFormatString(getToday(), "YYYY-MM-DD");
  // props로 받아오는 today는 캘린더 달의 첫째 날
  const currentMonthStr = dateToFormatString(today, "YYYY-MM");

  return (
    <div className="grid grid-cols-7 divide-x divide-x-textLight border-b border-textLight">
      {week[weekIdx].map((day, dayIdx) => {
        const dayStr = dateToFormatString(day, "YYYY-MM-DD");

        const isToday = todayStr === dayStr;
        const isSameMonth =
          currentMonthStr === dateToFormatString(day, "YYYY-MM");

        const baseDayClass = "pl-1 py-1 text-left text-xs h-36";
        const dayClass = clsx(baseDayClass, {
          "text-red-600": isSameMonth && dayIdx === 0,
          "text-blue-600": isSameMonth && dayIdx === 6,
          "text-textMain": isSameMonth && dayIdx !== 0 && dayIdx !== 6,
          "text-textNormal": !isSameMonth,
          "font-normal": isSameMonth,
          "font-light": !isSameMonth,
        });

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
  );
};

export default CalendarDateGrid;
