export const enum ApiPath {
  prefix = "/api/v1",

  STREAMER = ApiPath.prefix + "/streamer",
  STREAMER_ADD = ApiPath.STREAMER + "/add",

  SCHEDULE = ApiPath.prefix + "/schedule",
  SCHEDULE_ADD = ApiPath.SCHEDULE + "/add",
}

export const serverApiPath = (path: string) => {
  return path.replace("/api", "");
};
