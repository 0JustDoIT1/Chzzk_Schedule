import { ApiPath } from "@/constants/api-path";
import { IStreamer } from "@/schemas/streamer.schema";
import { clientAxios } from "./axios-server";
import { axiosError } from "@/utils/errorHandler";
import { IErrorResponse } from "@/types/error-response";

export const getAllStreamer = async (): Promise<
  IStreamer[] | IErrorResponse
> => {
  const res = await clientAxios
    .get(ApiPath.STREAMER)
    .then((res) => res.data)
    .catch((error) => axiosError(error));

  return res;
};

export const createStreamer = async (
  data: IStreamer
): Promise<IStreamer | IErrorResponse> => {
  const res = await clientAxios
    .post(ApiPath.STREAMER_ADD, data)
    .then((res) => res.data)
    .catch((error) => axiosError(error));

  return res;
};
