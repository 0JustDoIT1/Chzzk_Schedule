import { ISchedule } from "@/schemas/schedule.schema";
import { clientAxios } from "./axios-server";
import { ApiPath } from "@/constants/api-path";

export const createSchedule = async (data: ISchedule): Promise<ISchedule> => {
  const res = await clientAxios
    .post(ApiPath.SCHEDULE_ADD, data)
    .then((res) => res.data);

  return res;
};
