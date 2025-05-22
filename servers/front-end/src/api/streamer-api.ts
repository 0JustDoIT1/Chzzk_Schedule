import { ApiPath } from "@/constants/api-path";
import { getFetch } from "@/fetch/get-fetch";
import { postFetch } from "@/fetch/post-fetch";
import { IStreamer } from "@/schemas/streamer.schema";

export const getAllStreamer = async (): Promise<IStreamer[]> => {
  return await getFetch(true, ApiPath.STREAMER);
};

export const createStreamer = async (data: IStreamer): Promise<IStreamer> => {
  return await postFetch(false, ApiPath.STREAMER_ADD, data);
};
