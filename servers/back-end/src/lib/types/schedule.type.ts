import { Schedule } from 'src/schemas/schedule.schema';

export interface IDateSchedule {
  [key: string]: Schedule[];
}
