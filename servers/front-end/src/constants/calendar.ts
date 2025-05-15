import { IOption } from "@/types/optionType";

export const scheduleViewType = {
  calendar: "calendar",
  timeline: "timeline",
};

export const scheduleViewOption: IOption[] = [
  {
    value: scheduleViewType.calendar,
    label: "캘린더",
  },
  {
    value: scheduleViewType.timeline,
    label: "타임라인",
  },
];
