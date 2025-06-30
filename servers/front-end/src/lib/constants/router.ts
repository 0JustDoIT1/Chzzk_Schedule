import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export class route {
  static index = "/";
  static all = route.index + "all";
  static streamer = route.index + "streamer";
  static today = route.index + "today";
  static chzzk = route.index + "chzzk";
  static schedule = route.index + "schedule";
  static streaming = route.index + "streaming";
  static add = route.index + "add";

  static allCalendar = route.all + "/calendar";
  static allTimeline = route.all + "/timeline";

  static streamerCalendar = route.streamer + "/calendar";
  static streamerTimeline = route.streamer + "/timeline";

  static chzzkCalendar = route.chzzk + "/calendar";
  static chzzkTimeline = route.chzzk + "/timeline";

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
