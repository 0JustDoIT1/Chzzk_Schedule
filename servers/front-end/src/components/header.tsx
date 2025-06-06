"use client";

import MenuIcon from "assets/svg/menu";
import { useEffect, useState } from "react";
import { HeaderLink } from "./link";
import { CustomButton } from "./button";
import { route } from "@/constants/router";
import { useAsPathStore } from "@/providers/asPath-provider";
import { usePathname } from "next/navigation";

const Header = () => {
  /** save asPath state(previous, current) */
  const setAsPathData = useAsPathStore((state) => state.setAsPathData);

  const pathName = usePathname();

  useEffect(() => {
    setAsPathData(pathName);
  }, [pathName]);

  /** handle header menu */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-textMain/90 p-4 text-white backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 md:container lg:max-w-6xl">
        <div className="flex items-center space-x-4 text-xl font-bold">
          <HeaderLink href={route.index} classes="text-lg">
            0's Life
          </HeaderLink>
        </div>
        <div className="hidden items-center space-x-12 md:flex">
          <HeaderLink href={route.index} classes="text-sm">
            오늘
          </HeaderLink>
          <HeaderLink href={route.allCalendar} classes="text-sm">
            전체
          </HeaderLink>
          <HeaderLink href={route.streamer} classes="text-sm">
            스트리머별
          </HeaderLink>
          <HeaderLink href={route.chzzkCalendar} classes="text-sm">
            공식방송
          </HeaderLink>
        </div>
        <CustomButton classes="md:hidden" onClick={handleMenu}>
          <MenuIcon className="w-6 h-6 text-white" />
        </CustomButton>
      </div>
      <div
        className={`space-y-4 md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "h-52" : "h-0"
        }`}
      >
        <HeaderLink href={route.index} classes="text-sm w-full">
          오늘
        </HeaderLink>
        <HeaderLink href={route.allCalendar} classes="text-sm w-full">
          전체
        </HeaderLink>
        <HeaderLink href={route.streamer} classes="text-sm w-full">
          스트리머별
        </HeaderLink>
        <HeaderLink href={route.chzzkCalendar} classes="text-sm w-full">
          공식방송
        </HeaderLink>
      </div>
    </nav>
  );
};

export default Header;
