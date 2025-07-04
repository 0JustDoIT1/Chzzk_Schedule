import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export class route {
  static index = "/";
  static all = route.index + "all";
  static streamer = route.index + "streamer";
  static today = route.index + "today";
  static chzzk = route.index + "chzzk";
  static streaming = route.index + "streaming";
  static add = route.index + "add";

  // 해당 route는 const용 (실제 routing X)
  static schedule = route.index + "schedule";
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

export const goBackRoute = (
  router: AppRouterInstance,
  prevPath: string | null | undefined,
  fallbackPath: string
) => {
  const isInternalReferrer =
    typeof document !== "undefined" &&
    document.referrer && // 이전 페이지의 주소
    new URL(document.referrer).host === location.host; // 현재 사이트에서 이동한 경우만 허용

  if (prevPath) {
    router.push(prevPath);
  } else if (
    typeof window !== "undefined" &&
    window.history.length > 1 &&
    isInternalReferrer
  ) {
    router.back(); // 브라우저 히스토리 있는 경우
  } else {
    router.push(fallbackPath); // 완전한 fallback
  }
};

// calendar에서 date를 유지한채로 url 변경
export const getDatePreservedRoute = (
  basePath: string,
  searchParams: URLSearchParams
) => {
  const params = new URLSearchParams();
  const date = searchParams.get("date");
  if (date) params.set("date", date);

  const query = params.toString() ? `?${params.toString()}` : "";

  return `${basePath}${query}`;
};
