import { setDateAndTime } from "@shared/utils";
import { formatDateParts } from "./chzzk-date";
import { ISchedule, IScheduleInput } from "@shared/types";

export const getScheduleInitValue = (
  initData?: ISchedule
): IScheduleInput => {
  if (!initData) {
    const { date, time } = setDateAndTime();
    return {
      isOfficial: false,
      streamerName: "",
      category: "",
      title: "",
      memberInput: "",
      member: [],
      fullDay: false,
      startTimeKnown: true,
      endTimeKnown: true,
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
    isOfficial: initData.isOfficial,
    streamerName: initData.streamerName ?? "",
    category: initData.category ?? "",
    title: initData.title ?? "",
    memberInput: "",
    member: initData.member ?? [],
    fullDay: initData.fullDay,
    startTimeKnown: initData.startTimeKnown !== false,
    endTimeKnown: initData.endTimeKnown !== false,
    startAtDate: startAt.date,
    startAtTime: startAt.time,
    endAtDate: endAt.date,
    endAtTime: endAt.time,
    contents: initData.contents ?? "",
  };
};
