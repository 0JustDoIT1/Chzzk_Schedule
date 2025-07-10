import { setDateAndTime } from "@shared/utils";
import { formatDateParts } from "./chzzk-date";
import { ISchedule, IScheduleInput } from "@shared/types";

export const getScheduleInitValue = (
  initData?: ISchedule
): Partial<IScheduleInput> => {
  if (!initData) {
    const { date, time } = setDateAndTime();
    return {
      streamerName: "",
      category: "",
      title: "",
      memberInput: "",
      member: [],
      fullDay: false,
      startAtDate: date,
      startAtTime: time,
      endAtDate: date,
      endAtTime: time,
      contents: "",
    };
  }

  const startAt = formatDateParts(initData.startAt);
  const endAt = formatDateParts(initData.endAt);

  return {
    streamerName: initData.streamerName ?? "",
    category: initData.category ?? "",
    title: initData.title ?? "",
    memberInput: "",
    member: initData.member ?? [],
    fullDay: initData.fullDay,
    startAtDate: startAt.date,
    startAtTime: startAt.time,
    endAtDate: endAt.date,
    endAtTime: endAt.time,
    contents: initData.contents ?? "",
  };
};
