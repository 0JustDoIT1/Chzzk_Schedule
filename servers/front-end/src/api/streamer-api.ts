import { ApiPath } from "@/constants/api-path";
import { IStreamer } from "@/schemas/streamer.schema";
import { clientAxios } from "./axios-server";

export const getAllStreamer = async () => {
  const res = await clientAxios.get(ApiPath.STREAMER).then((res) => res.data);

  return res;
};

export const _getAllStreamer = async () => {
  const res = await clientAxios.get(ApiPath.STREAMER).then((res) => res.data);

  return res;
};

export const createStreamer = async (data: IStreamer) => {
  const res = await clientAxios
    .post(ApiPath.STREAMER_ADD, data)
    .then((res) => res.data);

  return res;
};
