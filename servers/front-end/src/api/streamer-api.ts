import { ApiPath } from "@/lib/constants/api-path";
import { getFetch } from "@/lib/fetch/get-fetch";
import { postFetch } from "@/lib/fetch/post-fetch";
import { IStreamer, TStreamerSchema } from "@/schemas/streamer.schema";

const isServer = () => typeof window === "undefined";

// Create streamer API
export const createStreamer = (
  data: IStreamer,
  token?: string
): Promise<TStreamerSchema> => {
  return postFetch(isServer(), ApiPath.STREAMER_ADD, data, token);
};

// Get all streamer list API
export const getAllStreamerList = (): Promise<TStreamerSchema[]> => {
  return getFetch(isServer(), ApiPath.STREAMER_ALL);
};

// Get streamer by Object Id
export const getStreamerById = (id: string): Promise<TStreamerSchema> => {
  return getFetch(isServer(), `${ApiPath.STREAMER_BY_ID}/${id}`);
};
