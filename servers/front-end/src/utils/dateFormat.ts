import "dayjs/locale/ko";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.locale("ko");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

export type dayjsType = dayjs.Dayjs;

export const getToday = () => {
  return dayjs();
};

export const getDayByString = (date: string) => {
  return dayjs(date);
};

// DateType을 원하는 형식 String으로 변환
export const dateToFormatString = (date: dayjs.ConfigType, format: string) => {
  if (!date) return "";
  return dayjs(date).format(format);
};

// Firebase의 utc string 시간에는 변환이 불가능(+,- 값을 저장하지 않고 자동 생성)
// 따라서, 임의로 서울 시간과 현재 지역 시간의 offset 편차를 계산하여 더함
export const dateToSeoulTime = (date: dayjs.ConfigType, format: string) => {
  const CurrentOffSet: number = dayjs().utcOffset();
  const SeoulOffset: number = 540;

  const DiffSeoulToCurrent = SeoulOffset - CurrentOffSet;

  return dayjs(date).add(DiffSeoulToCurrent, "minute").format(format);
};

// calendar에서 DateType을 Date로 변환
export const dateTypeToDate = (date: dayjs.ConfigType) => {
  return dayjs(date).toDate();
};

// date 날짜 차이 구하기기
export const getDateDiff = (
  date1: dayjs.ConfigType,
  date2: dayjs.ConfigType,
  type: dayjs.QUnitType
) => {
  return dayjs(date1).diff(date2, type);
};

// 시작 날짜 구하기
export const getStartDate = (
  date: dayjs.ConfigType,
  type: dayjs.OpUnitType
) => {
  return dayjs(date).startOf(type);
};

// 날짜 더하기
export const addDate = (
  date: dayjs.ConfigType,
  value: number,
  type: dayjs.ManipulateType
) => {
  return dayjs(date).add(value, type);
};

// 날짜 빼기
export const subtractDate = (
  date: dayjs.ConfigType,
  value: number,
  type: dayjs.ManipulateType
) => {
  return dayjs(date).subtract(value, type);
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
