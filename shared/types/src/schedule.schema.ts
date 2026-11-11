import { AllCategory } from "@shared/constants";
import { IBaseSchema } from "./base.schema";

export interface ISchedule {
  isOfficial: boolean;
  streamerName: string;
  streamerId: string;
  chzzkLink: string;
  category: AllCategory;
  title: string;
  member?: string[];
  memberIds?: string[];
  fullDay: boolean;
  startAt: Date;
  endAt: Date;
  contents?: string;
  sourceUrl?: string;
  revisionHistory?: {
    version: number;
    sourceUrl: string;
    reviewedAt: Date;
    note: string;
    changedFields: string[];
  }[];
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
