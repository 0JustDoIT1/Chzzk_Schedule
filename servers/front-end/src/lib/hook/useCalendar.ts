import {
  addDate,
  TDayjsType,
  getDateByString,
  getStartDate,
  getToday,
  subtractDate,
} from "@/lib/utils/dateFormat";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useCalendar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dateParam = searchParams.get("date");

  const [today, setToday] = useState<TDayjsType>(getToday());
  const [dayArray, setDayArray] = useState<{ [x: number]: TDayjsType[] }[]>([]);

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarRows = 7;
  const calendarColumns = 6;

  const daysInMonth = today.daysInMonth();
  const startDayOfMonth = getStartDate(today, "month");

  const preMonth = today.subtract(1, "month");
  const endDayOfPreMonth = preMonth.endOf("month");

  const nextMonth = today.add(1, "month");
  const startDayOfNextMonth = nextMonth.startOf("month");

  // Set today by url query
  useEffect(() => {
    if (!dateParam) return;
    const newDate = getDateByString(dateParam);
    setToday((prev) => (prev.isSame(newDate, "day") ? prev : newDate));
  }, [dateParam]);

  // Set calendar by today state
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

    const fullCalendar = [...preCalendar, ...nextEmptyDates];
    const result = [];

    for (let i = 0; i < calendarRows; i++) {
      result.push({
        [i]: fullCalendar.slice(
          i * calendarRows,
          i * calendarRows + calendarRows
        ),
      });
    }

    setDayArray(result);
  }, [today]);

  // Change url query when today update
  const updateToday = (date: TDayjsType) => {
    const formatDate = date.format("YYYY-MM-DD");
    router.replace(`?date=${formatDate}`);
  };

  const setPreMonth = () => {
    const prevDate = subtractDate(today, 1, "month");
    updateToday(getStartDate(prevDate, "M"));
  };

  const setNextMonth = () => {
    const nextDate = addDate(today, 1, "month");
    updateToday(getStartDate(nextDate, "M"));
  };

  const setPresentMonth = () => {
    updateToday(getToday());
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
