import { IBaseSchema } from "./base.schema";

export interface IStreamer {
  name: string;
  chzzkLink: string;
  tag?: string[];
  check: boolean;
}

export type TScheduleSchema = IStreamer & IBaseSchema;
