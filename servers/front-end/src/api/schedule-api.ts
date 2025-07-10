import {
  IDateSchedule,
  TMonthSchedule,
  ISchedule,
  TScheduleSchema,
} from "@/schemas/schedule.schema";
import { ApiPath } from "@/lib/constants/api-path";
import { postFetch } from "@/lib/fetch/post-fetch";
import { getFetch } from "@/lib/fetch/get-fetch";
import { patchFetch } from "@/lib/fetch/patch-fetch";
import { TStreamerSchema } from "@/schemas/streamer.schema";

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

// Get schedule list by month
export const getScheduleListByMonth = async (
  month: Date
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    `${ApiPath.SCHEDULE_BY_MONTH}/${month.toDateString()}`
  );
};

// Get Schedule list by Month with Object id
export const getScheduleListByMonthWithId = async (
  month: Date,
  id: string
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    `${ApiPath.SCHEDULE_BY_MONTH}/${month.toDateString()}/${id}`
  );
};

// Get Chzzk official Schedule list by Month
export const getOfficialScheduleListByMonth = async (
  month: Date
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    `${ApiPath.SCHEDULE_OFFICIAL_BY_MONTH}/${month.toDateString()}`
  );
};

// Get Schedule streamer info by Object id
export const getScheduleLinkById = async (
  id: string
): Promise<TStreamerSchema[]> => {
  return await getFetch(isServer(), `${ApiPath.SCHEDULE_LINK_BY_ID}/${id}`);
};
