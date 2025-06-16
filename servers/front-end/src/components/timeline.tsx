import { dateToFormatString, getToday } from "@/lib/utils/dateFormat";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "./link";
import { getModalRoute, getRoute, route } from "@/lib/constants/router";
import { IDateSchedule } from "@/schemas/schedule.schema";
import {
  BaseCategoryLabel,
  ChzzkCategoryLabel,
} from "@/lib/constants/streaming";

interface ICustomTimeLine {
  schedule: IDateSchedule;
}

const CustomTimeline = ({ schedule }: ICustomTimeLine) => {
  const scheduleKeyArr = Object.keys(schedule);

  if (scheduleKeyArr.length === 0)
    return (
      <div className="container flex justify-center items-center py-32 mx-auto md:pl-12 lg:max-w-6xl">
        <p className="text-xl text-textNormal">오늘 방송 일정이 없습니다.</p>
      </div>
    );

  return (
    <div className="container mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative md:border-l-2 md:border-brandMain">
        {scheduleKeyArr.map((key) => {
          const hourSchedule = schedule[key];

          let timeCircle = "";
          let circleText = "";

          if (dateToFormatString(getToday(), "HH") === key) {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-brandMain -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-white";
          } else {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-white -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-textNormal";
          }

          const timeText = (
            <p className={circleText}>
              {key}
              <span className="text-xs font-normal">시</span>
            </p>
          );

          return (
            <li key={key} className="mb-16 mx-8 md:ml-12 md:mr-8">
              <div className={timeCircle}>{timeText}</div>
              {hourSchedule.map((schedule) => {
                const category = schedule.isOfficial
                  ? ChzzkCategoryLabel[schedule.category]
                  : BaseCategoryLabel[schedule.category];

                const host = schedule.isOfficial ? "치지직" : schedule.streamer;

                return (
                  <div
                    key={schedule._id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-textSuperLight pb-2 mb-6"
                  >
                    <div>
                      <h3 className="flex items-center mb-1 text-lg font-normal text-textMain">
                        <span>&#91;{category}&#93;</span>&nbsp;{schedule.title}
                      </h3>
                      <div className="flex items-center mb-2 text-sm font-normal leading-none text-textNormal">
                        <p className="mr-1 mb-1">
                          <CalendarIcon className="w-4 h-4 text-textIcon" />
                        </p>
                        <p>
                          {dateToFormatString(
                            schedule.startAt,
                            "YYYY년 MM월 DD일 HH:mm"
                          )}
                        </p>
                      </div>
                      <div className="flex items-center text-base font-normal text-textNormal">
                        <p className="mr-1 mb-1">
                          <UserIcon className="w-4 h-4 text-textIcon" />
                        </p>
                        <p className="text-sm">{host}</p>
                        {/* {schedule.member && (
                        <div className="flex items-center flex-wrap">
                          {schedule.member.map((name, index) => {
                            const memberLength = schedule.member?.length;
                            const displayName =
                              memberLength === index + 1 ? name : `${name},`;

                            return (
                              <p key={name} className="text-sm">
                                {displayName}&nbsp;
                              </p>
                            );
                          })}
                        </div>
                      )} */}
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <BrandLink
                        href={getModalRoute(
                          getRoute(route.schedule, schedule._id)
                        )}
                        classes="w-full"
                      >
                        자세히 보기
                      </BrandLink>
                    </div>
                  </div>
                );
              })}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CustomTimeline;
