import { QueryClient } from "@tanstack/react-query";
import { dateToFormatString, dateTypeToDate } from "./dateFormat";
import { queryKeys } from "../constants/react-query";

// schedule-query-utils
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
