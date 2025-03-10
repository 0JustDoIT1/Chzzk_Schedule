import {
  addDate,
  dateToFormatString,
  dayjsType,
  getStartDate,
  getToday,
  subtractDate,
} from "@/utils/dateFormat";
import { useEffect, useState } from "react";

const useCalendar = () => {
  const [today, setToday] = useState<dayjsType>(getToday());
  const [dayArray, setDayArray] = useState<{ [x: number]: dayjsType[] }[]>([]);

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarRows = 7;
  const calendarColumns = 6;

  const daysInMonth = today.daysInMonth();
  const startDayOfMonth = getStartDate(today, "month");

  const preMonth = today.subtract(1, "month");
  const endDayOfPreMonth = preMonth.endOf("month");

  const nextMonth = today.add(1, "month");
  const startDayOfNextMonth = nextMonth.startOf("month");

  useEffect(() => {
    const days = Array.from({ length: daysInMonth }, (_, index) =>
      addDate(startDayOfMonth, index, "day")
    );
    const preEmptyDates = Array.from(
      { length: startDayOfMonth.day() },
      (_, index) => subtractDate(endDayOfPreMonth, index, "day")
    ).sort((a, b) => -1);

    const preCalendar = [...preEmptyDates, ...days];

    const calendarLength = calendarRows * calendarColumns;
    const currentDayLength = preCalendar.length;
    const nextDayLength = calendarLength - currentDayLength;

    const nextEmptyDates = Array.from({ length: nextDayLength }, (_, index) =>
      addDate(startDayOfNextMonth, index, "day")
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

  const setPreMonth = () => {
    let date = subtractDate(today, 1, "month");
    date = getStartDate(date, "M");
    setToday(date);
  };

  const setNextMonth = () => {
    let date = addDate(today, 1, "month");
    date = getStartDate(date, "M");
    setToday(date);
  };

  const setPresentMonth = () => {
    setToday(getToday());
  };

  return {
    today,
    setToday,
    dayArray,
    setDayArray,
    week,
    setPreMonth,
    setNextMonth,
    setPresentMonth,
  };
};

export default useCalendar;
