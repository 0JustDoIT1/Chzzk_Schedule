import { dateToFormatString, dayjsType, getToday } from "@/utils/dateFormat";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "./link";
import "dayjs/locale/ko";
import { useEffect } from "react";

interface CustomDayLine {
  schedule: {
    day: string;
    preList: {
      _id: string;
      title: string;
      member: string[];
      startAt: Date | dayjsType;
      endAt: Date | dayjsType;
    }[];
    list: {
      _id: string;
      title: string;
      member: string[];
      startAt: Date | dayjsType;
      endAt: Date | dayjsType;
    }[];
  }[];
}

const CustomDayline = ({ schedule }: CustomDayLine) => {
  useEffect(() => {
    const element = document.getElementById(
      dateToFormatString(getToday(), "YYYY-MM-DD")
    );
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const topOfElement = elementRect.top - 72 - 10;
      window.scroll({ top: topOfElement, behavior: "smooth" });
    } else {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, [schedule]);

  return (
    <div className="container mx-auto md:pl-12 lg:max-w-6xl">
      <ol className="relative md:border-l-2 md:border-brandMain">
        {schedule.map((list) => {
          let timeCircle = "";
          let circleText = "";

          if (dateToFormatString(getToday(), "YYYY-MM-DD") === list.day) {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-brandMain -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-white";
          } else {
            timeCircle +=
              "hidden absolute items-center justify-center w-12 h-12 rounded-full ring-4 ring-white border-2 border-brandMain bg-white -start-6 md:flex";
            circleText = "mt-[1px] text-base font-bold text-textNormal";
          }

          return (
            <li
              key={list.day}
              id={dateToFormatString(list.day, "YYYY-MM-DD")}
              className="mb-16 mx-8 md:ml-12 md:mr-8"
            >
              <div className={timeCircle}>
                <p className={circleText}>
                  {dateToFormatString(list.day, "DD")}
                </p>
                <p className="absolute top-12 py-1 text-center bg-white text-sm text-brandMain">
                  {dateToFormatString(list.day, "dddd")}
                </p>
              </div>
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
                        {item.member.map((member, index) => {
                          const memberLength = item.member.length;
                          const memberText =
                            memberLength === index + 1 ? member : `${member},`;

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
                    list.day && (
                    <div className="w-full md:w-auto">
                      <BrandLink
                        href={`/streaming/${item._id}`}
                        classes="w-full"
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
