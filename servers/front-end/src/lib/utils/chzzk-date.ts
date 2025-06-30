import dayjs from "dayjs";
import { dateToFormatString, isSameDate, TDayjsType } from "./dateFormat";
import { TScheduleSchema } from "@/schemas/schedule.schema";

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
