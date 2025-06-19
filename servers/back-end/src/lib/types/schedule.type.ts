import { ScheduleDocument } from 'src/schemas/schedule.schema';

export interface IDateSchedule {
  [key: string]: ScheduleDocument[];
}
