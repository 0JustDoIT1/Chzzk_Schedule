"use client";

import { getModalRoute, route } from "@/constants/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlusIcon from "~/public/assets/svg/plus";

export const FloatingButton = () => {
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  if (modal) return null;

  return (
    <div className="fixed bottom-8 right-8 md:bottom-12 md:right-16">
      <Link
        className="flex items-center bg-brandMain text-white py-3 px-4 rounded-full shadow-lg hover:bg-brandDark"
        href={getModalRoute(route.streamerAdd)}
        scroll={false}
      >
        <PlusIcon className="w-[20px] h-[20px] text-white md:w-[24px] md:h-[24px] md:mr-1" />
        <p className="text-sm mt-[1.5px] md:text-base">스트리머 추가</p>
      </Link>
    </div>
  );
};
