import { ApiPath, serverApiPath } from "@/constants/api-path";
import { IStreamer } from "@/schemas/streamer.schema";
import axios from "axios";
import axiosInstance from "./axios-server";

export const getAllStreamer = async () => {
  const res = await axios.get(ApiPath.STREAMER).then((res) => res.data);

  return res;
};

export const _getAllStreamer = async () => {
  const res = await axiosInstance
    .get(serverApiPath(ApiPath.STREAMER))
    .then((res) => res.data);

  return res;
};

export const createStreamer = async (data: IStreamer) => {
  const res = await axios
    .post(ApiPath.STREAMER_ADD, data)
    .then((res) => res.data);

  return res;
};
