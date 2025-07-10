import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/react-query";
import { dateToFormatString, dateTypeToDate } from "@shared/utils";

// streamer-query-utils
export const invalidateAllStreamerList = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.getAllStreamerList,
  });
};

export const invalidateStreamerById = (
  queryClient: QueryClient,
  id: string
) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.getStreamerById(id),
  });
};

// schedule-query-utils
export const invalidateScheduleById = (
  queryClient: QueryClient,
  id: string
) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.getScheduleById(id),
  });
};

export const invalidateScheduleListByDate = (
  queryClient: QueryClient,
  startAt: Date
) => {
  const dateStr = dateToFormatString(startAt, "YYYY-MM-DD");
  const date = dateTypeToDate(dateStr);

  queryClient.invalidateQueries({
    queryKey: queryKeys.getScheduleListByDate(date),
  });
};

export const invalidateScheduleListByMonth = (
  queryClient: QueryClient,
  startAt: Date
) => {
  const dateStr = dateToFormatString(startAt, "YYYY-MM-DD");
  const date = dateTypeToDate(dateStr);

  queryClient.invalidateQueries({
    queryKey: queryKeys.getScheduleListByMonth(date),
  });
};

export const invalidateScheduleListByMonthWithId = (
  queryClient: QueryClient,
  startAt: Date,
  id: string
) => {
  const dateStr = dateToFormatString(startAt, "YYYY-MM-DD");
  const date = dateTypeToDate(dateStr);

  queryClient.invalidateQueries({
    queryKey: queryKeys.getScheduleListByMonthWithId(date, id),
  });
};

export const invalidateOfficialScheduleListByMonth = (
  queryClient: QueryClient,
  startAt: Date
) => {
  const dateStr = dateToFormatString(startAt, "YYYY-MM-DD");
  const date = dateTypeToDate(dateStr);

  queryClient.invalidateQueries({
    queryKey: queryKeys.getOfficialScheduleListByMonth(date),
  });
};

export const invalidateScheduleLinkById = (
  queryClient: QueryClient,
  id: string
) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.getScheduleLinkById(id),
  });
};
