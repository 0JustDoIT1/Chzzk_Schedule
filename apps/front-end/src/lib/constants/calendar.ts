import { IOption } from "@/lib/types/optionType";

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

// 캘린더 스케줄의 일정 길이별 시작 위치
export const colStart = [
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

// 캘린더 스케줄의 일정 길이별 colspan
export const colSpan = [
  "col-span-1",
  "col-span-2",
  "col-span-3",
  "col-span-4",
  "col-span-5",
  "col-span-6",
  "col-span-7",
];

// 캘린더 셀에 각 스케줄 row 위치
export const rowStart = [
  "row-start-1",
  "row-start-2",
  "row-start-3",
  "row-start-4",
  "row-start-5",
  "row-start-6",
  "row-start-7",
];

// 캘린더 셀에 렌더링될 최대 스케줄 수
export const maxRenderCount = 4;
