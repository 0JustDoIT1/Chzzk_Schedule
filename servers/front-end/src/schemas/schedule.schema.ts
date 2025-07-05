import { IBaseSchema } from "./base.schema";

export enum BaseCategory {
  PERSONAL = "personal",
  TOGETHER = "together",
  CONTENT = "content",
  MATCH = "match",
}

export enum ChzzkCategory {
  OFFICIAL = "official",
  WATCH = "watch",
}

export enum AllCategory {
  PERSONAL = "personal",
  TOGETHER = "together",
  CONTENT = "content",
  MATCH = "match",
  OFFICIAL = "official",
  WATCH = "watch",
}

export const getStreamerNameByCategory = (
  category: AllCategory,
  streamerName?: string
) => {
  switch (category) {
    case AllCategory.OFFICIAL:
      return "치지직 공식";
    case AllCategory.WATCH:
      return "치지직 같이보기";
    default:
      if (!streamerName) {
        throw new Error("개인/콘텐츠 일정에는 스트리머가 필수입니다.");
      }
      return streamerName;
  }
};

export interface ISchedule {
  isOfficial: boolean;
  streamerName: string;
  streamerId: string;
  chzzkLink: string;
  category: AllCategory;
  title: string;
  member?: string[];
  fullDay: boolean;
  startAt: Date;
  endAt: Date;
  contents?: string;
}

export interface IScheduleInput {
  isOfficial: boolean;
  streamerName: string;
  category: AllCategory | "";
  title: string;
  memberInput: string;
  member?: string[];
  fullDay: boolean;
  startAtDate: string;
  startAtTime: string;
  endAtDate: string;
  endAtTime: string;
  contents?: string;
}

export type TScheduleSchema = ISchedule & IBaseSchema;

export interface IDateSchedule {
  [key: string]: TScheduleSchema[];
}

export interface IMonthScheduleItem {
  list: TScheduleSchema[];
}

export type TMonthSchedule = Record<string, IMonthScheduleItem>;
