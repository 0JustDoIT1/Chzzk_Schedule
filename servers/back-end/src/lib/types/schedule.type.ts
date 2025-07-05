import { ScheduleDocument } from 'src/schemas/schedule.schema';

export interface IDateSchedule {
  [key: string]: ScheduleDocument[];
}

export interface IMonthScheduleItem {
  list: ScheduleDocument[];
}

export type TMonthSchedule = Record<string, IMonthScheduleItem>;
