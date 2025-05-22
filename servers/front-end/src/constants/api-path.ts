export const enum ApiPath {
  PREFIX = "/v1",

  STREAMER = ApiPath.PREFIX + "/streamer",
  STREAMER_ADD = ApiPath.STREAMER + "/add",

  SCHEDULE = ApiPath.PREFIX + "/schedule",
  SCHEDULE_ADD = ApiPath.SCHEDULE + "/add",
}
