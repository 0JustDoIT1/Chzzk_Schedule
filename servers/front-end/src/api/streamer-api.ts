import axios from "axios";

export const createStreamer = async (data: any) => {
  const res = await axios.post("/api/streamer", data).then((res) => res.data);

  return res;
};
