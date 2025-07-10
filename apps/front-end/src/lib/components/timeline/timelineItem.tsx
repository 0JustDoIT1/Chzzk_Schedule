import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../common/link";
import { getRoute, route } from "@/lib/constants/router";
import { getScheduleDateString } from "@/lib/utils/chzzk-date";
import CategoryTag from "../common/categoryTag";
import { TScheduleSchema } from "@shared/types";
import { TDayjsType } from "@shared/utils";

interface ITimelineItem {
  schedule: TScheduleSchema;
  today: TDayjsType;
}

const TimelineItem = ({ schedule, today }: ITimelineItem) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4 border-b border-textSuperLight">
      <div className="p-2">
        <h3 className="flex items-center mb-2 text-lg font-normal text-textMain">
          <CategoryTag category={schedule.category} />
          <span className="ml-1">{schedule.title}</span>
        </h3>
        <div className="flex items-center mb-1 text-sm font-normal leading-none text-textNormal">
          <CalendarIcon className="mr-1 w-4 h-4 text-textIcon" />
          <span>{getScheduleDateString(schedule.startAt, today)}</span>
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
