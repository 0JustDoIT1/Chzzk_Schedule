import React from "react";
import { getRoute, route } from "@/lib/constants/router";
import {
  dateToFormatString,
  getDateDiff,
  TDayjsType,
} from "@/lib/utils/dateFormat";
import { TMonthSchedule, TScheduleSchema } from "@/schemas/schedule.schema";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  colSpan,
  colStart,
  maxRenderCount,
  rowStart,
} from "@/lib/constants/calendar";
import {
  findAvailableRow,
  isScheduleAlreadyRenderedInWeek,
} from "@/lib/utils/calendarUtils";

interface IDayScheduleItemProps {
  schedule: TScheduleSchema;
  dayIdx: number;
  dayStr: string;
  row: number;
  span: number;
}

interface IDayOverflowLink {
  dayStr: string;
  dayIdx: number;
  etcCount: number;
  etcLink: string;
}

interface IRenderScheduleItem {
  schedule: TScheduleSchema;
  row: number;
  span: number;
}

interface ICalendarScheduleOverlay {
  week: {
    [x: number]: TDayjsType[];
  };
  weekIdx: number;
  scheduleList: TMonthSchedule;
}

const DayScheduleItem = ({
  schedule,
  dayIdx,
  dayStr,
  row,
  span,
}: IDayScheduleItemProps) => {
  const linkClassName = clsx(
    colStart[dayIdx],
    colSpan[span - 1],
    rowStart[row],
    "h-5 px-1 bg-white border border-brandMain rounded-md text-textMain text-xs truncate"
  );

  return (
    <Link
      key={`${schedule._id}-${dayStr}`}
      className={linkClassName}
      href={getRoute(route.schedule, schedule._id)}
    >
      {schedule.title}
    </Link>
  );
};

const DayOverflowLink = ({
  dayStr,
  dayIdx,
  etcCount,
  etcLink,
}: IDayOverflowLink) => {
  return (
    <Link
      href={`${etcLink}?date=${dayStr}`}
      className={clsx(
        colStart[dayIdx],
        rowStart[maxRenderCount + 1],
        "flex items-center justify-center w-full h-5 px-1 bg-brandMain rounded-md text-white text-xs font-light truncate"
      )}
      scroll={false}
    >
      {etcCount}개 더보기
    </Link>
  );
};

const CalendarScheduleOverlay = ({
  week,
  weekIdx,
  scheduleList,
}: ICalendarScheduleOverlay) => {
  const pathName = usePathname();
  const etcLink = pathName.replace(route.calendar, route.timeline);

  // 해당 날짜 셀 안에 row-start를 위한 위치 (row 겹침 방지)
  const rowStack: Record<number, Set<number>> = {};
  // 이번 주 변수
  const currentWeek = week[weekIdx];

  return (
    <div className="absolute top-8 left-0 right-0 z-10 grid grid-cols-7 gap-[2px]">
      {currentWeek.map((day, dayIdx) => {
        // 캘린더 별 날짜
        const dayStr = dateToFormatString(day, "YYYY-MM-DD");
        // 캘린더 날짜(셀) 별 일정
        const daySchedule = scheduleList[dayStr]?.list ?? [];

        let renderCount = 0; // 렌더링된 일정 수
        // 렌더링 될 스케줄 배열 (스케줄, row: row-start 값, span: colSpan값)
        const renderSchedule: IRenderScheduleItem[] = [];
        for (const schedule of daySchedule) {
          // 렌더링된 일정 수가 최대 렌더링 수에 도달하면 종료
          if (renderCount >= maxRenderCount) break;

          // 이미 렌더링된 일정(긴 일정)이 아니라면 새로 그릴 렌더링 배열에 포함
          if (!isScheduleAlreadyRenderedInWeek(schedule, currentWeek, dayStr)) {
            // 일정 기간 계산
            const diff = getDateDiff(schedule.endAt, schedule.startAt, "d");
            // 며칠짜리 span인지 계산
            // why? diff+1 (ex. 월-수 => diff만은 2일이지만 span은 3일이어야 함)
            // 주를 넘지 않게 처리하기 위해서 7 - 날짜index를 통해 최소값 비교
            const span = Math.min(diff + 1, 7 - dayIdx);

            // 현재 일정이 차지할 grid의 row 결정
            // span이 되는 모든 column이 비어있어야 함
            // 충돌(conflict)이 없을 때까지 row 증가시켜서 찾음
            const row = findAvailableRow(rowStack, dayIdx, span);

            // rowStack에 span 범위 차지하는 col 모두 마킹
            for (let i = 0; i < span; i++) {
              const col = dayIdx + i;
              if (!rowStack[row]) rowStack[row] = new Set();
              rowStack[row].add(col);
            }
            renderSchedule.push({ schedule, row, span });
          }
          // 속하지 않은 일정 => render리스트
          // 속한 일정 => 이미 그려짐
          // 따라서 renderCount는 무조건 증가
          renderCount += 1;
        }

        const etcCount = Math.max(daySchedule.length - maxRenderCount, 0);

        return (
          <React.Fragment key={dayStr}>
            {renderSchedule.map(({ schedule, row, span }) => (
              <DayScheduleItem
                key={`${schedule._id}-${dayStr}`}
                schedule={schedule}
                dayIdx={dayIdx}
                dayStr={dayStr}
                row={row}
                span={span}
              />
            ))}

            {etcCount > 0 && (
              <DayOverflowLink
                dayStr={dayStr}
                dayIdx={dayIdx}
                etcCount={etcCount}
                etcLink={etcLink}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CalendarScheduleOverlay;
