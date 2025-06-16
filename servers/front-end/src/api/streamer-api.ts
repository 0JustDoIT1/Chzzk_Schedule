import { ApiPath } from "@/lib/constants/api-path";
import { getFetch } from "@/lib/fetch/get-fetch";
import { postFetch } from "@/lib/fetch/post-fetch";
import { IStreamer } from "@/schemas/streamer.schema";

const isServer = () => typeof window === "undefined";

// Create streamer API
export const createStreamer = (
  data: IStreamer,
  token?: string
): Promise<IStreamer> => {
  return postFetch(isServer(), ApiPath.STREAMER_ADD, data, token);
};

// Get all streamer list API
export const getAllStreamerList = (): Promise<IStreamer[]> => {
  return getFetch(isServer(), ApiPath.STREAMER_ALL);
};
