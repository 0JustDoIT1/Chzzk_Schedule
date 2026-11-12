import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../common/link";
import { getRoute, route } from "@/lib/constants/router";
import { displayDate } from "@/lib/utils/chzzk-date";
import CategoryTag from "../common/categoryTag";
import { TScheduleSchema } from "@shared/types";

interface ITimelineItem {
  schedule: TScheduleSchema;
}

const TimelineItem = ({ schedule }: ITimelineItem) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4 border-b border-textSuperLight">
      <div className="p-2">
        <h3 className="flex items-center mb-2 text-lg font-normal text-textMain">
          <CategoryTag category={schedule.category} />
          <span className="ml-1">{schedule.status === "cancelled" ? `[취소] ${schedule.title}` : schedule.title}</span>
        </h3>
        <div className="flex items-center mb-1 text-sm font-normal leading-none text-textNormal">
          <CalendarIcon className="mr-1 w-4 h-4 text-textIcon" />
          <span>{displayDate(schedule)}</span>
        </div>
        <div className="flex items-center mb-1 text-sm font-normal text-textNormal">
          <UserIcon className="mr-1 w-4 h-4 text-textIcon" />
          <span>{schedule.streamerName}</span>
        </div>
      </div>
      <div className="w-full md:w-auto">
        <BrandLink
          href={getRoute(route.detail, schedule._id)}
          className="w-full"
        >
          자세히 보기
        </BrandLink>
      </div>
    </div>
  );
};

export default TimelineItem;
