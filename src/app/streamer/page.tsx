"use client";

import { TestStreamerList } from "@/constants/test";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const StreamerPage = () => {
  const [initialList, setInitialList] = useState<string[]>([]);
  const [streamerList, setStreamerList] = useState<{
    [x: string]: string[];
  } | null>(null);

  const getInitials = (name: string) => {
    const str = name;
    const cho = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 0xac00 && charCode <= 0xd7a3) {
        const uni = charCode - 0xac00;
        const choIdx = Math.floor(uni / (21 * 28));
        result += cho[choIdx];
      } else {
        result += str[i];
      }
    }
    return result;
  };

  const scrollSection = (initial: string) => {
    const element = document.getElementById(initial);
    const topOfElement = element!.offsetTop - 72 - 20;
    window.scroll({ top: topOfElement, behavior: "smooth" });
  };

  useEffect(() => {
    const result: { [x: string]: string[] } = {};
    TestStreamerList.forEach((item) => {
      const initial = getInitials(item.member.slice(0, 1));
      if (result[initial]) {
        result[initial].push(item.member);
      } else {
        result[initial] = [item.member];
      }
    });
    setInitialList(Object.keys(result).sort());
    setStreamerList(result);
  }, []);

  console.log("###", streamerList);

  return (
    <React.Fragment>
      <section className="w-full border-b border-b-gray-300 py-6">
        <div className="container mx-auto flex flex-col gap-4 items-center justify-between px-4 md:px-8 md:flex-row lg:max-w-6xl">
          <div className="flex flex-col items-center w-full md:w-1/3 md:items-start">
            <p className="text-2xl">스트리머별 일정</p>
            <p className="text-sm text-gray-500">
              원하는 스트리머 방송 일정을 살펴보세요.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container mx-auto px-4 md:px-8 lg:max-w-6xl">
          {streamerList && (
            <React.Fragment>
              <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                {initialList.map((initial) => (
                  <button
                    key={initial}
                    type="button"
                    className="py-1 px-6 text-xl text-gray-700 ring-2 ring-brandMain shadow-md rounded-lg"
                    onClick={() => scrollSection(initial)}
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
                    <p className="text-lg text-gray-700 mb-2">
                      &#42; {initial}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {streamerList[initial].map((streamer) => (
                        <Link
                          key={streamer}
                          href={`/streamer/${streamer}`}
                          className="py-1 px-2 text-sm text-white bg-brandMain ring-1 ring-gray-300 shadow-sm rounded-lg"
                        >
                          {streamer}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
    </React.Fragment>
  );
};

export default StreamerPage;
