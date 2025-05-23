import { ApiPath } from "@/constants/api-path";
import { getFetch } from "@/fetch/get-fetch";
import { postFetch } from "@/fetch/post-fetch";
import { IStreamer } from "@/schemas/streamer.schema";

// Create streamer API
export const createStreamer = async (data: IStreamer): Promise<IStreamer> => {
  return await postFetch(false, ApiPath.STREAMER_ADD, data);
};

// Get all streamer list API
export const getAllStreamerList = async (): Promise<IStreamer[]> => {
  return await getFetch(true, ApiPath.STREAMER);
};
