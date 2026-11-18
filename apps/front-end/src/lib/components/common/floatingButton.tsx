"use client";

import { route } from "@/lib/constants/router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PlusIcon from "~/public/assets/svg/plus";

export const FloatingButton = () => {
  const pathName = usePathname();
  if (pathName === route.index || pathName === route.scheduleAdd) return null;
  return <div className="fixed bottom-4 right-4 z-40 md:bottom-12 md:right-16">
    <Link aria-label="스트리머 제보" className="flex h-12 w-12 items-center justify-center rounded-full bg-brandMain text-white shadow-lg hover:bg-brandDark md:h-auto md:w-auto md:px-4 md:py-3" href={route.add} scroll={false}>
      <PlusIcon className="h-6 w-6 text-white md:mr-1" />
      <p className="hidden text-base md:block">스트리머 제보</p>
    </Link>
  </div>;
};
