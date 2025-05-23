import { IDateSchedule, ISchedule } from "@/schemas/schedule.schema";
import { ApiPath } from "@/constants/api-path";
import { postFetch } from "@/fetch/post-fetch";
import { getFetch } from "@/fetch/get-fetch";

// Create schedule
export const createSchedule = async (data: ISchedule): Promise<ISchedule> => {
  return await postFetch(false, ApiPath.SCHEDULE_ADD, data);
};

// Get schedule list by date
export const getScheduleListByDate = async (
  date: Date
): Promise<IDateSchedule> => {
  return await getFetch(false, `${ApiPath.SCHEDULE}/${date}`);
};
