export const ApiPath = {
  PREFIX: "v1",

  STREAMER: "streamer",
  STREAMER_ALL: "all",
  STREAMER_ADD: "add",
  STREAMER_BY_ID: "id/:id",
  STREAMER_BY_NAME: "name/:name",

  SCHEDULE: "schedule",
  SCHEDULE_ADD: "add",
  SCHEDULE_UPDATE: "update/:id",
  SCHEDULE_BY_ID: "id/:id",
  SCHEDULE_BY_DATE: "date/:date",
  SCHEDULE_BY_MONTH: "month/:month",
  SCHEDULE_BY_MONTH_WITH_ID: "month/:month/:id",
  SCHEDULE_OFFICIAL_BY_MONTH: "official/month/:month",
  SCHEDULE_LINK_BY_ID: "link/:id",
} as const;

export type ApiPathKey = keyof typeof ApiPath;

// api path 생성기 (프론트 용)
// 가변인자로 string 배열로 생성
export function buildApiPath(...path: string[]) {
  // path 합치기
  const joinPath = path.join("/");
  // params를 객체 형태로 받음 (ex. {id: 123})
  return (params?: Record<string, string | number>) => {
    let apiPath = joinPath;
    // params가 있을 경우
    if (params) {
      // params 객체를 배열로 변경
      // [key, val] 형태로 반복문 실행
      for (const [key, val] of Object.entries(params)) {
        // 위에 선언한 apiPath에 해당하는 key가 있으면 val로 변경
        apiPath = apiPath.replace(`:${key}`, encodeURIComponent(String(val)));
      }
    }
    return apiPath;
  };
}
