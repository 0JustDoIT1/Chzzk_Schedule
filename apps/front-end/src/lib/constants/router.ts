import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const route = {
  // Base Route
  index: "/",
  all: "/all",
  streamer: "/streamer",
  today: "/today",
  chzzk: "/chzzk",

  // 해당 route는 const용 (실제 routing X)
  schedule: "/schedule",
  calendar: "/calendar",
  timeline: "/timeline",

  // 실제 사용되는 Route
  allCalendar: "/all/calendar",
  allTimeline: "/all/timeline",

  chzzkCalendar: "/chzzk/calendar",
  chzzkTimeline: "/chzzk/timeline",

  scheduleAdd: "/schedule/add",
  scheduleEdit: "/schedule/edit",

  // Modal Route
  add: "/add",
  detail: "/detail",
  channel: "/channel",
} as const;

export const getRoute = (basePath: string, ...segments: string[]) => {
  const trimmedBase = basePath.replace(/\/+$/, "");
  const fullPath = segments.map((s) => s.replace(/^\/+|\/+$/g, "")).join("/");
  return `${trimmedBase}/${fullPath}`;
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
