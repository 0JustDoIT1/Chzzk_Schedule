import { ScheduleDocument } from 'src/schemas/schedule.schema';

export interface IDateSchedule {
  [key: string]: ScheduleDocument[];
}

export interface IMonthScheduleItem {
  day: string;
  preList: ScheduleDocument[];
  list: ScheduleDocument[];
}

export type IMonthSchedule = IMonthScheduleItem[];
