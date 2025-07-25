import "dayjs/locale/ko";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.locale("ko");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

dayjs.tz.setDefault("Asia/Seoul");

export type TDayjsType = dayjs.Dayjs;

// 오늘 날짜 구하기
export const getToday = () => {
  return dayjs().tz();
};

// string 날짜 dayjs형태로 전환
export const getDayjs = (date: dayjs.ConfigType) => {
  return dayjs(date).tz();
};

// DateType을 원하는 형식 String으로 변환
export const dateToFormatString = (date: dayjs.ConfigType, format: string) => {
  if (!date) return "";
  return dayjs(date).tz().format(format);
};

// DateType을 Date로 변환 (calendar, input string -> date)
export const dateTypeToDate = (date: dayjs.ConfigType) => {
  return dayjs(date).tz().toDate();
};

// date 날짜 차이 구하기기
export const getDateDiff = (
  date1: dayjs.ConfigType,
  date2: dayjs.ConfigType,
  type: dayjs.QUnitType
) => {
  return dayjs(date1).tz().diff(date2, type);
};

// 시작 날짜 구하기
export const getStartDate = (
  date: dayjs.ConfigType,
  type: dayjs.OpUnitType
) => {
  return dayjs(date).tz().startOf(type);
};

// 마지막 날짜 구하기
export const getEndDate = (date: dayjs.ConfigType, type: dayjs.OpUnitType) => {
  return dayjs(date).tz().endOf(type);
};

// 날짜 더하기
export const addDate = (
  date: dayjs.ConfigType,
  value: number,
  type: dayjs.ManipulateType
) => {
  return dayjs(date).tz().add(value, type);
};

// 날짜 빼기
export const subtractDate = (
  date: dayjs.ConfigType,
  value: number,
  type: dayjs.ManipulateType
) => {
  return dayjs(date).tz().subtract(value, type);
};

// 현재 시간 따라 30분 단위 설정
export const setDateAndTime = () => {
  let dateTime = getToday();
  if (0 <= dateTime.minute() && dateTime.minute() < 30) {
    dateTime = dateTime.minute(30);
  } else {
    dateTime = addDate(dateTime, 1, "hour");
    dateTime = dateTime.minute(0);
  }

  const date = dateToFormatString(dateTime, "YYYY-MM-DD");
  const time = dateToFormatString(dateTime, "HH:mm");

  return { date, time };
};

// 날짜가 이전인지 비교
export const isBeforeDate = (
  baseDate: dayjs.ConfigType,
  targetDate: dayjs.ConfigType
) => {
  return dayjs(baseDate).tz().isBefore(targetDate, "date");
};

// 날짜가 같은지 비교
export const isSameDate = (
  baseDate: dayjs.ConfigType,
  targetDate: dayjs.ConfigType
) => {
  return dayjs(baseDate).tz().isSame(targetDate, "date");
};

// 날짜가 이후인지 비교
export const isAfterDate = (
  baseDate: dayjs.ConfigType,
  targetDate: dayjs.ConfigType
) => {
  return dayjs(baseDate).tz().isAfter(targetDate, "date");
};

// 날짜가 기간 안에 속해있는지 검증
export const isBetweenDate = (
  date: dayjs.ConfigType,
  startDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType
) => {
  return dayjs(date).tz().isBetween(startDate, endDate, "date");
};
