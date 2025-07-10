import { TScheduleSchema } from "@shared/types";
import { dateToFormatString, TDayjsType } from "@shared/utils";

/**
 * 현재 일정이 차지할 grid의 row 결정
 * span이 되는 모든 column이 비어있어야 함
 * 충돌(conflict)이 없을 때까지 row 증가시켜서 찾음
 * @param rowStack
 * @param dayIdx
 * @param span
 * @returns
 */
export const findAvailableRow = (
  rowStack: Record<number, Set<number>>,
  dayIdx: number,
  span: number
): number => {
  let row = 1;
  while (true) {
    // 현재 row가 다른 일정에 의해 차지되어 있는지 확인하는 flag
    let conflict = false;
    // 현재 row가 해당 span만큼 비어 있는지 확인
    for (let i = 0; i < span; i++) {
      const col = dayIdx + i;
      if (rowStack[row]?.has(col)) {
        conflict = true;
        break;
      }
    }
    if (!conflict) return row;
    row++;
  }
};

/**
 * 해당 일정이 주(week)에 이미 속해진(렌더링된) 일정인지 체크
 * @param schedule
 * @param currentWeek
 * @param currentDayStr
 * @returns
 */
export function isScheduleAlreadyRenderedInWeek(
  schedule: TScheduleSchema,
  currentWeek: TDayjsType[],
  currentDayStr: string
): boolean {
  // 스케줄의 시작일과 종료일
  const start = dateToFormatString(schedule.startAt, "YYYY-MM-DD");
  const end = dateToFormatString(schedule.endAt, "YYYY-MM-DD");

  // 속해있다면 true, 아니라면 false
  // start <= wDayStr <= end && wDayStr < dayStr
  return currentWeek.some((wDay) => {
    const wDayStr = dateToFormatString(wDay, "YYYY-MM-DD");
    return wDayStr < currentDayStr && wDayStr >= start && wDayStr <= end;
  });
}
