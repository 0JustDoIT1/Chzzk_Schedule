import React from "react";
import CalendarDateGrid from "./calendarDateGrid";
import CalendarScheduleOverlay from "./calendarScheduleOverlay";
import CalendarHeaderRow from "./calendarHeaderRow";
import { TMonthSchedule } from "@shared/types";
import { TDayjsType } from "@shared/utils";

interface ICustomCalendar {
  today: TDayjsType;
  weekHeader: string[];
  dayArray: { [x: number]: TDayjsType[] }[];
  isHasSchedule?: boolean;
  scheduleList?: TMonthSchedule;
}

const CustomCalendar = ({
  today,
  weekHeader,
  dayArray,
  isHasSchedule = false,
  scheduleList,
}: ICustomCalendar) => {
  scheduleList = isHasSchedule ? scheduleList : undefined;

  return (
    <div className="w-full">
      <p className="border-b border-gray-100 px-4 py-3 text-xs text-textNormal md:hidden">달력을 좌우로 밀어 전체 날짜를 볼 수 있어요.</p>
      <div className="overflow-x-auto overscroll-x-contain" aria-label="월간 일정 달력">
      <div className="box-border min-w-[700px] w-full md:min-w-0">
        <CalendarHeaderRow weekHeader={weekHeader} />
        {dayArray.map((week, weekIdx) => (
          <div key={weekIdx} className="relative w-full">
            <CalendarDateGrid week={week} weekIdx={weekIdx} today={today} />
            {isHasSchedule && scheduleList && (
              <CalendarScheduleOverlay
                week={week}
                weekIdx={weekIdx}
                scheduleList={scheduleList}
              />
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
