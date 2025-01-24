import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useCalendar = () => {
  const [today, setToday] = useState<dayjs.Dayjs>(dayjs());
  const [dayArray, setDayArray] = useState<{ [x: number]: dayjs.Dayjs[] }[]>(
    []
  );

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarRows = 7;
  const calendarColumns = 6;

  const daysInMonth = today.daysInMonth();
  const startDayOfMonth = dayjs(today).startOf("month");

  const preMonth = today.subtract(1, "month");
  const endDayOfPreMonth = preMonth.endOf("month");

  const nextMonth = today.add(1, "month");
  const startDayOfNextMonth = nextMonth.startOf("month");

  useEffect(() => {
    const days = Array.from({ length: daysInMonth }, (_, index) =>
      dayjs(startDayOfMonth).add(index, "day")
    );
    const preEmptyDates = Array.from(
      { length: startDayOfMonth.day() },
      (_, index) => dayjs(endDayOfPreMonth).subtract(index, "day")
    ).sort((a, b) => -1);

    const preCalendar = [...preEmptyDates, ...days];

    const calendarLength = calendarRows * calendarColumns;
    const currentDayLength = preCalendar.length;
    const nextDayLength = calendarLength - currentDayLength;

    const nextEmptyDates = Array.from({ length: nextDayLength }, (_, index) =>
      dayjs(startDayOfNextMonth).add(index, "day")
    );

    const nextCalendar = [...preCalendar, ...nextEmptyDates];
    const result = [];

    for (let i = 0; i < calendarRows; i++) {
      result.push({
        [i]: nextCalendar.slice(
          i * calendarRows,
          i * calendarRows + calendarRows
        ),
      });
    }

    setDayArray(result);
  }, [today]);

  return { today, setToday, dayArray, setDayArray, week };
};

export default useCalendar;
