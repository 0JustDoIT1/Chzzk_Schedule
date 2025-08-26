import { getFetch } from "@/lib/fetch/get-fetch";
import { postFetch } from "@/lib/fetch/post-fetch";
import { ApiPath, buildApiPath } from "@shared/constants";
import { IStreamer, TStreamerSchema } from "@shared/types";

const isServer = () => typeof window === "undefined";

// Create streamer API
export const createStreamer = (
  data: IStreamer,
  token?: string
): Promise<TStreamerSchema> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.STREAMER,
    ApiPath.STREAMER_ADD
  )();
  return postFetch(isServer(), url, data, token);
};

// Get all streamer list API
export const getAllStreamerList = (): Promise<TStreamerSchema[]> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.STREAMER,
    ApiPath.STREAMER_ALL
  )();
  return getFetch(isServer(), url);
};

// Get streamer by Object Id
export const getStreamerById = (id: string): Promise<TStreamerSchema> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.STREAMER,
    ApiPath.STREAMER_BY_ID
  )({ id });
  return getFetch(isServer(), url);
};

// Get streamer by Object Id
export const getStreamerByName = (name: string): Promise<TStreamerSchema> => {
  const url = buildApiPath(
    ApiPath.PREFIX,
    ApiPath.STREAMER,
    ApiPath.STREAMER_BY_NAME
  )({ name });
  return getFetch(isServer(), url);
};
