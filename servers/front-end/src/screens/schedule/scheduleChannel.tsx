"use client";

import { getScheduleLinkById } from "@/api/schedule-api";
import ChzzkLink from "@/components/common/ChzzkLink";
import IsError from "@/components/layout/isError";
import IsLoading from "@/components/layout/isLoading";
import { queryKeys } from "@/lib/constants/react-query";
import { useQuery } from "@tanstack/react-query";

interface IScheduleChannelView {
  id: string;
}

const ScheduleChannelView = ({ id }: IScheduleChannelView) => {
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getScheduleLinkById(id),
    queryFn: () => getScheduleLinkById(id),
    enabled: !!id,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError || !data) return <IsError />;

  const [mainStreamer, ...members] = data;

  return (
    <section className="w-full p-4 space-y-6">
      {isSuccess && (
        <>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-textMain">
              메인 스트리머
            </h2>
            <ChzzkLink name={mainStreamer.name} url={mainStreamer.chzzkLink} />
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-textNormal">
                합방 스트리머
              </h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <ChzzkLink
                    key={member._id}
                    name={member.name}
                    url={member.chzzkLink}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ScheduleChannelView;
