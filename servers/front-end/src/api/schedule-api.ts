import { IDateSchedule, ISchedule } from "@/schemas/schedule.schema";
import { ApiPath } from "@/lib/constants/api-path";
import { postFetch } from "@/lib/fetch/post-fetch";
import { getFetch } from "@/lib/fetch/get-fetch";

const isServer = () => typeof window === "undefined";

// Create schedule
export const createSchedule = async (
  data: ISchedule,
  token?: string
): Promise<ISchedule> => {
  return await postFetch(isServer(), ApiPath.SCHEDULE_ADD, data, token);
};

// Get schedule list by date
export const getScheduleListByDate = async (
  date: Date
): Promise<IDateSchedule> => {
  return await getFetch(
    isServer(),
    `${ApiPath.SCHEDULE}/${date.toDateString()}`
  );
};
