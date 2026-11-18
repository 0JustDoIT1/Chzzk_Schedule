"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { TMonthSchedule } from "@shared/types";
import { dateToFormatString, getToday, TDayjsType } from "@shared/utils";
import { getRoute, route } from "@/lib/constants/router";
import CategoryTag from "@/lib/components/common/categoryTag";

interface MobileCalendarProps {
  month: TDayjsType;
  dayArray: { [x: number]: TDayjsType[] }[];
  scheduleList?: TMonthSchedule;
}

export default function MobileCalendar({ month, dayArray, scheduleList }: MobileCalendarProps) {
  const monthKey = dateToFormatString(month, "YYYY-MM");
  const todayKey = dateToFormatString(getToday(), "YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(() =>
    monthKey === todayKey.slice(0, 7) ? todayKey : `${monthKey}-01`
  );

  useEffect(() => {
    setSelectedDate(monthKey === todayKey.slice(0, 7) ? todayKey : `${monthKey}-01`);
  }, [monthKey, todayKey]);

  const days = dayArray.flatMap((week) => Object.values(week)).filter((week) => week.length > 0).flat();
  const selectedSchedules = scheduleList?.[selectedDate]?.list ?? [];

  return (
    <div className="md:hidden">
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 text-center text-xs font-semibold text-textNormal">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => <span key={day} className="py-3">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-100" aria-label="월간 날짜 선택">
        {days.map((day) => {
          const key = dateToFormatString(day, "YYYY-MM-DD");
          const count = scheduleList?.[key]?.list?.length ?? 0;
          const currentMonth = key.startsWith(monthKey);
          const active = key === selectedDate;
          return (
            <button
              key={key}
              type="button"
              aria-label={`${dateToFormatString(day, "M월 D일")}, 일정 ${count}건`}
              aria-pressed={active}
              onClick={() => setSelectedDate(key)}
              className={clsx(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 bg-white text-sm",
                !currentMonth && "text-gray-400",
                currentMonth && "text-textMain",
                active && "bg-green-50 font-bold text-brandDark",
                key === todayKey && !active && "font-bold text-brandDark"
              )}
            >
              <span>{dateToFormatString(day, "D")}</span>
              {count > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brandMain" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="space-y-3 p-4">
        <h2 className="text-base font-bold text-textMain">{selectedDate.slice(5, 7)}월 {Number(selectedDate.slice(8))}일 일정 <span className="text-brandDark">{selectedSchedules.length}건</span></h2>
        {selectedSchedules.length === 0 && <p className="rounded-xl bg-gray-50 p-4 text-sm text-textNormal">등록된 일정이 없습니다.</p>}
        {selectedSchedules.map((schedule) => (
          <Link key={schedule._id} href={getRoute(route.detail, schedule._id)} className="block rounded-xl border border-gray-200 p-3 hover:border-green-300 hover:bg-green-50">
            <CategoryTag category={schedule.category} />
            <p className="mt-2 text-sm font-semibold text-textMain">{schedule.status === "cancelled" ? `[취소] ${schedule.title}` : schedule.title}</p>
            <p className="mt-1 text-xs text-textNormal">{schedule.streamerName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
