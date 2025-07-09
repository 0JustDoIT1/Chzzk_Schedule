const enum ApiPath {
  STREAMER = 'streamer',
  STREAMER_ALL = '/all',
  STREAMER_ADD = '/add',
  STREAMER_BY_ID = 'id/:id',
  STREAMER_BY_NAME = 'name/:name',

  SCHEDULE = 'schedule',
  SCHEDULE_ADD = '/add',
  SCHEDULE_UPDATE = '/update/:id',
  SCHEDULE_BY_ID = '/id/:id',
  SCHEDULE_BY_DATE = '/date/:date',
  SCHEDULE_BY_MONTH = '/month/:month',
  SCHEDULE_LINK_BY_ID = '/link',
}
