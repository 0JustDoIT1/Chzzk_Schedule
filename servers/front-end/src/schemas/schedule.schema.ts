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

export interface ISchedule {
  isOfficial: boolean;
  streamer?: string;
  category: AllCategory;
  title: string;
  member?: string[];
  startAt: Date;
  endAt: Date;
  contents?: string;
}

export interface IScheduleInput {
  isOfficial: boolean;
  streamer?: string;
  category: AllCategory;
  title: string;
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
