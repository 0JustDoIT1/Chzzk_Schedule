import { dateToFormatString } from "@/utils/dateFormat";
import Link from "next/link";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";

interface CustomTimeLine {
  schedule: {
    time: number;
    list: {
      _id: string;
      title: string;
      member: string[];
      startAt: Date;
    }[];
  }[];
}

const CustomTimeline = ({ schedule }: CustomTimeLine) => {
  return (
    <div className="container mx-auto md:pl-12 md:flex-row lg:max-w-[1200px]">
      <ol className="relative md:border-l md:border-gray-200">
        {schedule.map((list) => {
          const timeText = list.time === -1 ? "미정" : `${list.time}시`;
          return (
            <li key={list.time} className="mb-16 mx-8 md:ml-12 md:mr-8">
              <div className="hidden absolute items-center justify-center w-12 h-12 bg-blue-100 rounded-full -start-6 md:flex">
                <p className="text-gray-600">{timeText}</p>
              </div>
              {list.list.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-2 mb-6"
                >
                  <div>
                    <h3 className="flex items-center mb-1 text-lg font-normal text-gray-900">
                      {item.title}
                    </h3>
                    <div className="flex flex-row items-center mb-2 text-sm font-normal leading-none text-gray-500">
                      <span className="mr-1 mb-1">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </span>
                      {dateToFormatString(
                        item.startAt,
                        "YYYY년 MM월 DD일 HH:mm"
                      )}
                    </div>
                    <div className="flex flex-row items-center text-base font-normal text-gray-500">
                      <span className="mr-1 mb-1">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </span>
                      <div className="flex flex-row items-center flex-wrap">
                        {item.member.map((member, index) => {
                          const memberLength = item.member.length;
                          const memberText =
                            memberLength === index + 1 ? member : `${member},`;

                          return <p key={member}> {memberText}&nbsp;</p>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <Link
                      href="/streaming"
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      방송 보기
                      <ArrowUpRightFromSquareIcon className="w-4 h-4 text-gray-900 mt-[0.5]" />
                    </Link>
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
