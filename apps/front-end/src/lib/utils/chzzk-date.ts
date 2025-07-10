import dayjs from "dayjs";
import { TScheduleSchema } from "@shared/types";
import { dateToFormatString, isSameDate, TDayjsType } from "@shared/utils";

// 타임라인 안에 날짜 비교 후 format 변환
export const getScheduleDateString = (
  date: dayjs.ConfigType,
  today: TDayjsType
) =>
  isSameDate(date, today)
    ? dateToFormatString(date, "YYYY년 MM월 DD일 HH:mm")
    : dateToFormatString(today, "YYYY년 MM월 DD일");

// 일시에 따라 표현 방식 변경
export const displayDate = (data: TScheduleSchema) => {
  const startAtDate = dateToFormatString(data.startAt, "YYYY-MM-DD");
  const startAtTime = dateToFormatString(data.startAt, "HH:mm");
  const endAtDate = dateToFormatString(data.startAt, "YYYY-MM-DD");
  const endAtTime = dateToFormatString(data.startAt, "HH:mm");

  let result = startAtDate;
  if (startAtDate === endAtDate) {
    if (startAtTime === endAtTime) {
      result += ` ${startAtTime}`;
    } else {
      result += ` ${startAtTime} - ${endAtTime}`;
    }
  } else {
    result += ` ${startAtTime} ~ ${endAtDate} ${endAtTime}`;
  }

  return result;
};

// 종일 체크 or 날짜 비교에 따라 값 조정
export const adjustScheduleTimes = ({
  startAtDate,
  startAtTime,
  endAtDate,
  endAtTime,
  fullDay,
  setValue,
}: {
  startAtDate: string;
  startAtTime: string;
  endAtDate: string;
  endAtTime: string;
  fullDay: boolean;
  setValue: (name: string, value: any, options?: any) => void;
}) => {
  if (fullDay) {
    setValue("endAtDate", startAtDate, { shouldValidate: true });
    setValue("startAtTime", "00:00", { shouldValidate: true });
    setValue("endAtTime", "23:59", { shouldValidate: true });
  }

  if (startAtDate === endAtDate && startAtTime > endAtTime) {
    setValue("startAtTime", endAtTime);
    setValue("endAtTime", startAtTime);
  } else if (startAtDate > endAtDate) {
    setValue("startAtDate", endAtDate);
    setValue("endAtDate", startAtDate);
  }
};

// 중복 날짜 표시 date와 time 묶기
export const formatDateParts = (date: Date) => ({
  date: dateToFormatString(date, "YYYY-MM-DD"),
  time: dateToFormatString(date, "HH:mm"),
});
