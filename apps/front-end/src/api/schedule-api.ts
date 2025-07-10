import { postFetch } from "@/lib/fetch/post-fetch";
import { getFetch } from "@/lib/fetch/get-fetch";
import { patchFetch } from "@/lib/fetch/patch-fetch";
import {
  IDateSchedule,
  ISchedule,
  TMonthSchedule,
  TScheduleSchema,
  TStreamerSchema,
} from "@shared/types";
import { ApiPath, buildApiPath } from "@shared/constants";

const isServer = () => typeof window === "undefined";

// Create schedule
export const createSchedule = async (
  data: Partial<ISchedule>,
  token?: string
): Promise<ISchedule> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.SCHEDULE,
    ApiPath.SCHEDULE_ADD
  )();
  return await postFetch(isServer(), url, data, token);
};

// Update schedule
export const updateSchedule = async (
  id: string,
  data: Partial<ISchedule>,
  token?: string
): Promise<ISchedule> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.SCHEDULE,
    ApiPath.SCHEDULE_UPDATE
  )({ id });
  return await patchFetch(isServer(), url, data, token);
};

// Get schedule by Id
export const getScheduleById = async (id: string): Promise<TScheduleSchema> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.SCHEDULE,
    ApiPath.SCHEDULE_BY_ID
  )({ id });
  return await getFetch(isServer(), url);
};

// Get schedule list by date
export const getScheduleListByDate = async (
  date: Date
): Promise<IDateSchedule> => {
  return await getFetch(
    isServer(),
    buildApiPath(
      ApiPath.PREFIX,
      ApiPath.SCHEDULE,
      ApiPath.SCHEDULE_BY_DATE
    )({ date: date.toDateString() })
  );
};

// Get schedule list by month
export const getScheduleListByMonth = async (
  month: Date
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    buildApiPath(
      ApiPath.PREFIX,
      ApiPath.SCHEDULE,
      ApiPath.SCHEDULE_BY_MONTH
    )({ month: month.toDateString() })
  );
};

// Get Schedule list by Month with Object id
export const getScheduleListByMonthWithId = async (
  month: Date,
  id: string
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    buildApiPath(
      ApiPath.PREFIX,
      ApiPath.SCHEDULE,
      ApiPath.SCHEDULE_BY_MONTH_WITH_ID
    )({ month: month.toDateString(), id })
  );
};

// Get Chzzk official Schedule list by Month
export const getOfficialScheduleListByMonth = async (
  month: Date
): Promise<TMonthSchedule> => {
  return await getFetch(
    isServer(),
    buildApiPath(
      ApiPath.PREFIX,
      ApiPath.SCHEDULE,
      ApiPath.SCHEDULE_OFFICIAL_BY_MONTH
    )({ month: month.toDateString() })
  );
};

// Get Schedule streamer info by Object id
export const getScheduleLinkById = async (
  id: string
): Promise<TStreamerSchema[]> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.SCHEDULE,
    ApiPath.SCHEDULE_LINK_BY_ID
  )({ id });
  return await getFetch(isServer(), url);
};
