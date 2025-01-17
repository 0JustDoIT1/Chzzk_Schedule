import { TestTodayList } from "@/constants/test";
import { dateToFormatString } from "@/utils/dateFormat";
import CalendarIcon from "assets/svg/calendar";
import PlusIcon from "assets/svg/plus";
import Link from "next/link";
import ArrowUpIcon from "~/public/assets/svg/arrow-up";
import UserIcon from "~/public/assets/svg/user";

const HomePage = () => {
  return (
    <main className="bg-white w-full flex flex-col items-center">
      {/* <div className="text-center p-4">
        <div className="text-6xl font-bold text-white my-4">0's Life</div>
        <div className="text-2xl text-white my-4">인터넷 방송 스케줄러</div>
        <div className="w-full rounded-md bg-white bg-opacity-10 p-4">
          0's Life는 치지직 스트리머들의 방송일정을 한눈에 모아보는
          웹사이트입니다. 누구나 방송일정을 만들고 수정하고 공유할 수 있으니,
          많은 참여 부탁드립니다.
        </div>
      </div> */}
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-[1200px]">
          <div className="flex flex-col">
            <p className="text-2xl">오늘의 일정</p>
            <p className="text-sm text-gray-500">
              <span className="text-base text-green-500">
                {dateToFormatString(new Date(), "YYYY년 MM월 DD일 dddd")}
              </span>
              &nbsp;치지직 방송일정입니다.
            </p>
          </div>
          <div className="px-8 w-full md:px-4 md:w-auto">
            <Link
              href="/schedule/add"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PlusIcon className="w-4 h-4 text-gray-900 mt-[0.5]" />
              일정 추가
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-6">
        <div className="container mx-auto py-6 md:pl-16 md:flex-row lg:max-w-[1200px]">
          <ol className="relative md:border-l md:border-gray-200">
            {TestTodayList.map((list) => {
              const timeText = list.time === -1 ? "미정" : `${list.time}시`;
              return (
                <li key={list.time} className="mb-16 mx-12">
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
                                memberLength === index + 1
                                  ? member
                                  : `${member},`;

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
                          <ArrowUpIcon className="w-4 h-4 text-gray-900 mt-[0.5]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
