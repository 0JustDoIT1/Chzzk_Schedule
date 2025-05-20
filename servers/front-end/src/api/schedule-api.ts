import { ApiPath } from "@/constants/api-path";
import { ISchedule } from "@/schemas/schedule.schema";
import axios from "axios";

export const createSchedule = async (data: ISchedule) => {
  const res = await axios
    .post(ApiPath.SCHEDULE_ADD, data)
    .then((res) => res.data);

  return res;
};
