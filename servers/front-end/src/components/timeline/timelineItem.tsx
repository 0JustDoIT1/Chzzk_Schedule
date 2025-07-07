import {
  AllCategoryLabel,
  categoryColorMap,
} from "@/lib/constants/streamingCategory";
import { TScheduleSchema } from "@/schemas/schedule.schema";
import CalendarIcon from "~/public/assets/svg/calendar";
import UserIcon from "~/public/assets/svg/user";
import { BrandLink } from "../link";
import { getRoute, route } from "@/lib/constants/router";
import { TDayjsType } from "@/lib/utils/dateFormat";
import clsx from "clsx";
import { getScheduleDateString } from "@/lib/utils/chzzk-date";

interface ITimelineItem {
  schedule: TScheduleSchema;
  today: TDayjsType;
  category: typeof AllCategoryLabel;
}

const TimelineItem = ({ schedule, today, category }: ITimelineItem) => {
  const categoryStyle = clsx(
    "mr-2 font-semibold",
    categoryColorMap[schedule.category]
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-textSuperLight pb-2 mb-6">
      <div>
        <h3 className="flex items-center mb-1 text-lg font-normal text-textMain">
          <span className={categoryStyle}>
            &#91;{category[schedule.category]}&#93;
          </span>
          &nbsp;{schedule.title}
        </h3>
        <div className="flex items-center mb-2 text-sm font-normal leading-none text-textNormal">
          <p className="mr-1 mb-1">
            <CalendarIcon className="w-4 h-4 text-textIcon" />
          </p>
          <p>{getScheduleDateString(schedule.startAt, today)}</p>
        </div>
        <div className="flex items-center text-base font-normal text-textNormal">
          <p className="mr-1 mb-1">
            <UserIcon className="w-4 h-4 text-textIcon" />
          </p>
          <p className="text-sm">{schedule.streamerName}</p>
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
