import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../common/link";
import { getRoute, route } from "@/lib/constants/router";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";
import CategoryTag from "../common/categoryTag";
import Link from "next/link";
import { SESSION_STORAGE_KEY } from "@/lib/constants/sessionStorage";
import { TScheduleSchema } from "@shared/types";
import { displayDate } from "@/lib/utils/chzzk-date";

interface TodayStreamingLinkProps {
  scheduleId: string;
}

interface IDaylineItem {
  item: TScheduleSchema;
  isToday: boolean;
}

const TodayStreamingLink = ({ scheduleId }: TodayStreamingLinkProps) => {
  return (
    <div className="w-full shrink-0 md:w-[120px]">
      <BrandLink
        href={getRoute(route.channel, scheduleId)}
        className="w-full"
        scroll={false}
      >
        방송 보기
        <ArrowUpRightFromSquareIcon className="w-4 h-4 text-textMain" />
      </BrandLink>
    </div>
  );
};

const DaylineItem = ({ item, isToday }: IDaylineItem) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-green-200">
      <Link
        href={getRoute(route.detail, item._id)}
        className="min-w-0 flex-grow rounded-lg p-2 hover:bg-green-50"
        aria-label={`방송 상세 보기: ${item.title}`}
        scroll={false}
        onClick={() => {
          sessionStorage.setItem(
            SESSION_STORAGE_KEY.DAYLINE_SCROLL,
            String(window.scrollY)
          );
        }}
      >
        <h3 className="mb-2 flex flex-wrap items-center gap-2 text-lg font-semibold text-textMain">
          <CategoryTag category={item.category} />
          <span>{item.status === "cancelled" ? `[취소] ${item.title}` : item.title}</span>
        </h3>
        <div className="flex items-center mb-1 text-sm font-normal leading-none text-textNormal">
          <CalendarIcon className="mr-1 w-4 h-4 text-textIcon" />
          <span>
            {displayDate(item)}
          </span>
        </div>
        <div className="flex items-center mb-1 text-sm font-normal text-textNormal">
          <UserIcon className="mr-1 w-4 h-4 text-textIcon" />
          <span>{item.streamerName}</span>
        </div>
      </Link>
      {isToday && item.status !== "cancelled" && <TodayStreamingLink scheduleId={item._id} />}
    </div>
  );
};

export default DaylineItem;
