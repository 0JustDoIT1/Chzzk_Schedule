import { TDayjsType } from "@/lib/utils/dateFormat";
import { TMonthSchedule } from "@/schemas/schedule.schema";
import React from "react";
import CalendarDateGrid from "./calendarDateGrid";
import CalendarScheduleOverlay from "./calendarScheduleOverlay";
import CalendarHeaderRow from "./calendarHeaderRow";

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
    <div className="w-full mx-auto lg:max-w-6xl">
      <div className="box-border w-full border border-textLight border-y-0">
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
  );
};

export default CustomCalendar;
