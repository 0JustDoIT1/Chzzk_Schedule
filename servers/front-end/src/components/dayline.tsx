import {
  dateToFormatString,
  TDayjsType,
  getToday,
} from "@/lib/utils/dateFormat";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "./link";
import { useEffect } from "react";
import { sorting } from "@/lib/utils/sort";
import { getRoute, route } from "@/lib/constants/router";
import { TMonthSchedule } from "@/schemas/schedule.schema";

interface ICustomDayLine {
  scheduleList: TMonthSchedule;
  date: TDayjsType;
}

const CustomDayline = ({ scheduleList, date }: ICustomDayLine) => {
  const dateString = dateToFormatString(date, "YYYY-MM-DD");

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const element = document.getElementById(dateString);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const topOfElement = elementRect.top - 72 - 10;
      window.scroll({ top: topOfElement, behavior: "smooth" });
    } else {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, [scheduleList, date]);

  if (scheduleList.length === 0)
    return (
      <div className="container flex justify-center items-center py-32 mx-auto md:pl-12 lg:max-w-6xl">
        <p className="text-xl text-textNormal">이번 달 방송 일정이 없습니다.</p>
      </div>
    );

  return (
    <div className="w-full mt-12 mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative ml-12 border-l-2 border-brandMain md:ml-0">
        {scheduleList.map((schedule) => {
          let timeCircle = "";
          let circleText = "";

          if (dateString === schedule.day) {
            timeCircle +=
              "flex absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-brandMain -start-6";
            circleText = "mt-[1px] text-base font-bold text-white";
          } else {
            timeCircle +=
              "flex absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-white -start-6";
            circleText = "mt-[1px] text-base font-bold text-textNormal";
          }

          const dayList = sorting(
            [...schedule.list, ...schedule.preList],
            1,
            "startAt"
          );

          return (
            <li
              key={schedule.day}
              id={dateToFormatString(schedule.day, "YYYY-MM-DD")}
              className="mb-16 ml-12 mr-8 md:mr-0"
            >
              {dayList.length > 0 && (
                <div className={timeCircle}>
                  <p className={circleText}>
                    {dateToFormatString(schedule.day, "DD")}
                  </p>
                  <p className="absolute top-12 py-1 text-center bg-white text-sm text-brandMain">
                    {dateToFormatString(schedule.day, "dddd")}
                  </p>
                </div>
              )}
              {dayList.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-textSuperLight pb-2 mb-6"
                >
                  <div>
                    <h3 className="flex items-center mb-1 text-lg font-normal text-textMain">
                      {item.title}
                    </h3>
                    <div className="flex items-center mb-2 text-sm font-normal leading-none text-textNormal">
                      <span className="mr-1 mb-1">
                        <CalendarIcon className="w-4 h-4 text-textIcon" />
                      </span>
                      <span>
                        {dateToFormatString(
                          item.startAt,
                          "YYYY년 MM월 DD일 HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-base font-normal text-textNormal">
                      <span className="mr-1 mb-1">
                        <UserIcon className="w-4 h-4 text-textIcon" />
                      </span>
                      <div className="flex items-center flex-wrap">
                        {item.member &&
                          item.member.map((member: string, index: number) => {
                            const memberLength = item.member?.length;
                            const memberText =
                              memberLength === index + 1
                                ? member
                                : `${member},`;

                            return (
                              <p key={member} className="text-sm">
                                {memberText}&nbsp;
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  {dateToFormatString(getToday(), "YYYY-MM-DD") ===
                    schedule.day && (
                    <div className="w-full md:w-auto">
                      <BrandLink
                        href={getRoute(route.streaming, item._id)}
                        className="w-full"
                      >
                        방송 보기
                        <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain mt-[0.5]" />
                      </BrandLink>
                    </div>
                  )}
                </div>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CustomDayline;
