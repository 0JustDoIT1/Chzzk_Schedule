export const enum ApiPath {
  PREFIX = "/v1",

  STREAMER = ApiPath.PREFIX + "/streamer",
  STREAMER_ALL = ApiPath.STREAMER + "/all",
  STREAMER_ADD = ApiPath.STREAMER + "/add",
  STREAMER_BY_ID = ApiPath.STREAMER + "/id",
  STREAMER_BY_NAME = ApiPath.STREAMER + "/name",

  SCHEDULE = ApiPath.PREFIX + "/schedule",
  SCHEDULE_ADD = ApiPath.SCHEDULE + "/add",
  SCHEDULE_BY_ID = ApiPath.SCHEDULE + "/id",
  SCHEDULE_BY_DATE = ApiPath.SCHEDULE + "/date",
  SCHEDULE_BY_MONTH = ApiPath.SCHEDULE + "/month",
}
