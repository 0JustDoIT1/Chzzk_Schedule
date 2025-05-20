import { dateToFormatString, TDayjsType, getToday } from "@/utils/dateFormat";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "./link";
import { getModalRoute, getRoute, route } from "@/constants/router";

interface ICustomTimeLine {
  schedule: {
    time: number;
    list: {
      _id: string;
      title: string;
      member: string[];
      startAt: Date | TDayjsType;
    }[];
  }[];
}

const CustomTimeline = ({ schedule }: ICustomTimeLine) => {
  return (
    <div className="container mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative md:border-l-2 md:border-brandMain">
        {schedule.map((list) => {
          let timeCircle = "";
          let circleText = "";

          if (getToday().hour() === list.time) {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-brandMain -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-white";
          } else {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-white -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-textNormal";
          }

          const timeText =
            list.time === -1 ? (
              <p className={circleText}>미정</p>
            ) : (
              <p className={circleText}>
                {list.time}
                <span className="text-xs font-normal">시</span>
              </p>
            );

          return (
            <li key={list.time} className="mb-16 mx-8 md:ml-12 md:mr-8">
              <div className={timeCircle}>{timeText}</div>
              {list.list.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-textSuperLight pb-2 mb-6"
                >
                  <div>
                    <h3 className="flex items-center mb-1 text-lg font-normal text-textMain">
                      {item.title}
                    </h3>
                    <div className="flex items-center mb-2 text-sm font-normal leading-none text-textNormal">
                      <p className="mr-1 mb-1">
                        <CalendarIcon className="w-4 h-4 text-textIcon" />
                      </p>
                      <p>
                        {dateToFormatString(
                          item.startAt,
                          "YYYY년 MM월 DD일 HH:mm"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center text-base font-normal text-textNormal">
                      <p className="mr-1 mb-1">
                        <UserIcon className="w-4 h-4 text-textIcon" />
                      </p>
                      <div className="flex items-center flex-wrap">
                        {item.member.map((name, index) => {
                          const memberLength = item.member.length;
                          const displayName =
                            memberLength === index + 1 ? name : `${name},`;

                          return (
                            <p key={name} className="text-sm">
                              {displayName}&nbsp;
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <BrandLink
                      href={getModalRoute(getRoute(route.streaming, item._id))}
                      classes="w-full"
                    >
                      방송 보기
                      <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain mt-[0.5]" />
                    </BrandLink>
                  </div>
                </div>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CustomTimeline;
