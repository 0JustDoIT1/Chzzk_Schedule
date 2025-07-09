"use client";

import { getAllStreamerList } from "@/api/streamer-api";
import IsError from "@/components/layout/isError";
import IsLoading from "@/components/layout/isLoading";
import { queryKeys } from "@/lib/constants/react-query";
import { getRoute, route } from "@/lib/constants/router";
import { getInitials } from "@/lib/utils/chzzk-utils";
import { TStreamerSchema } from "@/schemas/streamer.schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const StreamerCategoryView = () => {
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  const [initialList, setInitialList] = useState<string[]>([]);
  const [streamerList, setStreamerList] = useState<{
    [x: string]: TStreamerSchema[];
  } | null>(null);

  const scrollSection = (initial: string) => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const element = document.getElementById(initial);
    const topOfElement = element!.offsetTop - 72 - 10;
    window.scroll({ top: topOfElement, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isSuccess) return;

    const result: { [x: string]: TStreamerSchema[] } = {};
    data.forEach((streamer) => {
      const initial = getInitials(streamer.name.slice(0, 1));
      if (result[initial]) {
        result[initial].push(streamer);
      } else {
        result[initial] = [streamer];
      }
    });

    setInitialList(Object.keys(result).sort());
    setStreamerList(result);

    window.scroll({ top: 0, behavior: "smooth" });
  }, [data, isSuccess]);

  return (
    <main>
      <section className="w-full border-b border-b-textLight py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">스트리머별 일정</p>
            <p className="text-sm text-textNormal">
              원하는 스트리머 방송 일정을 살펴보세요.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container mx-auto px-4 md:px-8 lg:max-w-6xl">
          {streamerList && (
            <>
              <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                {initialList.map((initial) => (
                  <button
                    key={initial}
                    type="button"
                    className="py-1 px-6 text-xl text-textMain ring-2 ring-brandMain shadow-md rounded-lg"
                    onClick={() => scrollSection(initial)}
                    aria-label={`${initial} 이니셜로 이동`}
                  >
                    {initial}
                  </button>
                ))}
              </div>
              <div className="mt-16">
                {initialList.map((initial) => (
                  <div
                    key={initial}
                    id={initial}
                    className="flex flex-col mt-16"
                  >
                    <p className="text-lg text-textMain mb-2">
                      &#42; {initial}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {streamerList[initial].map((streamer) => (
                        <Link
                          key={streamer._id}
                          href={getRoute(
                            route.streamer,
                            streamer._id,
                            route.calendar
                          )}
                          className="py-1 px-2 text-sm text-white bg-brandMain ring-1 ring-textLight shadow-sm rounded-lg hover:bg-brandMainHover"
                          aria-label={`${streamer.name} 일정 보기`}
                        >
                          {streamer.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default StreamerCategoryView;
