import { ISchedule } from "@/schemas/schedule.schema";
import { ApiPath } from "@/constants/api-path";
import { postFetch } from "@/fetch/post-fetch";

export const createSchedule = async (data: ISchedule): Promise<ISchedule> => {
  return await postFetch(false, ApiPath.SCHEDULE_ADD, data);
};
