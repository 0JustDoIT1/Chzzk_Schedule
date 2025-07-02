import {
  IDateSchedule,
  ISchedule,
  TScheduleSchema,
} from "@/schemas/schedule.schema";
import { ApiPath } from "@/lib/constants/api-path";
import { postFetch } from "@/lib/fetch/post-fetch";
import { getFetch } from "@/lib/fetch/get-fetch";
import { patchFetch } from "@/lib/fetch/patch-fetch";

const isServer = () => typeof window === "undefined";

// Create schedule
export const createSchedule = async (
  data: Partial<ISchedule>,
  token?: string
): Promise<ISchedule> => {
  return await postFetch(isServer(), ApiPath.SCHEDULE_ADD, data, token);
};

// Update schedule
export const updateSchedule = async (
  id: string,
  data: Partial<ISchedule>,
  token?: string
): Promise<ISchedule> => {
  return await patchFetch(
    isServer(),
    `${ApiPath.SCHEDULE_UPDATE}/${id}`,
    data,
    token
  );
};

// Get schedule by Id
export const getScheduleById = async (id: string): Promise<TScheduleSchema> => {
  return await getFetch(isServer(), `${ApiPath.SCHEDULE_BY_ID}/${id}`);
};

// Get schedule list by date
export const getScheduleListByDate = async (
  date: Date
): Promise<IDateSchedule> => {
  return await getFetch(
    isServer(),
    `${ApiPath.SCHEDULE_BY_DATE}/${date.toDateString()}`
  );
};
