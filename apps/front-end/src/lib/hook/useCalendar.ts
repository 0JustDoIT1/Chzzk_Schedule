import {
  addDate,
  getDayjs,
  getStartDate,
  getToday,
  subtractDate,
  TDayjsType,
} from "@shared/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useCalendar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dateParam = searchParams.get("date");

  const [today, setToday] = useState<TDayjsType>(getToday());
  const [dayArray, setDayArray] = useState<{ [x: number]: TDayjsType[] }[]>([]);

  const weekHeader = ["일", "월", "화", "수", "목", "금", "토"];

  const daysPerWeek = 7;
  const maxWeeks = 6;

  // Set today by url query
  useEffect(() => {
    if (!dateParam) return;
    const newDate = getDayjs(dateParam);
    setToday((prev) => (prev.isSame(newDate, "day") ? prev : newDate));
  }, [dateParam]);

  // Set calendar by today state
  useEffect(() => {
    const daysInMonth = today.daysInMonth();
    const startDayOfMonth = getStartDate(today, "M");
    const endDayOfPreMonth = today.subtract(1, "M").endOf("M");
    const startDayOfNextMonth = today.add(1, "M").startOf("M");
    const days = Array.from({ length: daysInMonth }, (_, index) =>
      addDate(startDayOfMonth, index, "day")
    );
    const preEmptyDates = Array.from(
      { length: startDayOfMonth.day() },
      (_, index) => subtractDate(endDayOfPreMonth, index, "day")
    ).sort((a, b) => a.valueOf() - b.valueOf());

    const preCalendar = [...preEmptyDates, ...days];

    const calendarLength = daysPerWeek * maxWeeks;
    const currentDayLength = preCalendar.length;
    const nextDayLength = calendarLength - currentDayLength;

    const nextEmptyDates = Array.from({ length: nextDayLength }, (_, index) =>
      addDate(startDayOfNextMonth, index, "day")
    );

    const fullCalendar = [...preCalendar, ...nextEmptyDates];
    const result = [];

    for (let i = 0; i < maxWeeks; i++) {
      result.push({
        [i]: fullCalendar.slice(
          i * daysPerWeek,
          i * daysPerWeek + daysPerWeek
        ),
      });
    }

    setDayArray(result.filter((week) =>
      Object.values(week)[0].some((day) => day.isSame(today, "M"))
    ));
  }, [today]);

  // Change url query when today update
  const updateToday = (date: TDayjsType) => {
    const formatDate = date.format("YYYY-MM-DD");
    router.replace(`?date=${formatDate}`);
  };

  const setPreMonth = () => {
    const prevDate = subtractDate(today, 1, "M");
    updateToday(getStartDate(prevDate, "M"));
  };

  const setNextMonth = () => {
    const nextDate = addDate(today, 1, "M");
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
    weekHeader,
    setPreMonth,
    setNextMonth,
    setPresentMonth,
  };
};

export default useCalendar;
