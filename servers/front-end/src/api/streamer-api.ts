import { ApiPath } from "@/constants/api-path";
import { IStreamer } from "@/schemas/streamer.schema";
import axios from "axios";

export const createStreamer = async (data: IStreamer) => {
  const res = await axios
    .post(ApiPath.STREAMER_ADD, data)
    .then((res) => res.data);

  return res;
};
