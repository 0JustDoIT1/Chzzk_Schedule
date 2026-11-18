"use client";

import { getAllStreamerList } from "@/api/streamer-api";
import IsError from "@/lib/components/layout/isError";
import IsLoading from "@/lib/components/layout/isLoading";
import { queryKeys } from "@/lib/constants/react-query";
import { getRoute, route } from "@/lib/constants/router";
import { getInitials } from "@/lib/utils/chzzk-utils";
import { TStreamerSchema } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const StreamerCategoryView = () => {
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: queryKeys.getAllStreamerList,
    queryFn: getAllStreamerList,
    placeholderData: (prev) => prev,
  });

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

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;

  return (
    <main>
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left">
            <h1 className="mb-1 text-3xl font-bold text-textMain">스트리머별 일정</h1>
            <p className="text-sm text-textNormal">
              원하는 스트리머 방송 일정을 살펴보세요.
            </p>
          </div>
        </div>
      </section>
      <section className="min-h-[calc(100vh-180px)] bg-[#f7faf8] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {streamerList && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:justify-start">
                {initialList.map((initial) => (
                  <button
                    key={initial}
                    type="button"
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-base font-semibold text-brandDark hover:bg-green-100"
                    onClick={() => scrollSection(initial)}
                    aria-label={`${initial} 이니셜로 이동`}
                  >
                    {initial}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-5">
                {initialList.map((initial) => (
                  <div
                    key={initial}
                    id={initial}
                    className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <p className="mb-4 text-lg font-bold text-textMain">
                      {initial}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {streamerList[initial].map((streamer) => (
                        <Link
                          key={streamer.name}
                          href={getRoute(
                            route.streamer,
                            streamer.name,
                            route.calendar
                          )}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-textMain transition-colors hover:border-green-200 hover:bg-green-50 hover:text-brandDark"
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
