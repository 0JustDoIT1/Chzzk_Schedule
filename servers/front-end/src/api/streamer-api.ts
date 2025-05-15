import { ApiPath } from "@/constants/api-path";
import axios from "axios";

export const createStreamer = async (data: any) => {
  const res = await axios.post(ApiPath.STREAMER, data).then((res) => res.data);

  return res;
};
