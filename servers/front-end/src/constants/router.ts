export class route {
  static index = "/";
  static all = route.index + "all";
  static streamer = route.index + "streamer";
  static chzzk = route.index + "chzzk";
  static schedule = route.index + "schedule";
  static streaming = route.index + "streaming";

  static calendar = route.index + "calendar";
  static timeline = route.index + "timeline";

  static allCalendar = route.all + route.calendar;
  static allTimeline = route.all + route.timeline;

  static streamerCalendar = route.streamer + route.calendar;
  static streamerTimeline = route.streamer + route.timeline;

  static chzzkCalendar = route.chzzk + route.calendar;
  static chzzkTimeline = route.chzzk + route.timeline;

  static scheduleAdd = route.schedule + "/add";
  static scheduleEdit = route.schedule + "/edit";
}

export const getRoute = (path: string, arg: string) => {
  return `${path}/${arg}`;
};
