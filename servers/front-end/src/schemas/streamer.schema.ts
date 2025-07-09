import { IBaseSchema } from "./base.schema";

export interface IStreamer {
  isOfficial: boolean;
  name: string;
  chzzkLink: string;
  tag?: string[];
  check: boolean;
}

export type TStreamerSchema = IStreamer & IBaseSchema;
