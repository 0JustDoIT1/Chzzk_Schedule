"use client";

import MenuIcon from "assets/svg/menu";
import { useEffect, useState } from "react";
import { HeaderLink } from "../common/link";
import { CustomButton } from "../common/button";
import { route } from "@/lib/constants/router";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/constants/menu";
import clsx from "clsx";

const Header = () => {
  /** save asPath state(previous, current) */
  const setAsPathData = useAsPathStore((state) => state.setAsPathData);

  const pathName = usePathname();

  useEffect(() => {
    setAsPathData(pathName);
  }, [pathName]);

  /** handle header menu */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="sticky top-0 z-50 bg-textMain/90 p-4 text-white backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 md:container lg:max-w-6xl">
        <div className="flex items-center space-x-4 text-xl font-bold">
          <HeaderLink href={route.index} className="text-lg">
            0's Life
          </HeaderLink>
        </div>
        <div className="hidden items-center space-x-12 md:flex">
          {menuItems.map((menu) => (
            <HeaderLink key={menu.href} href={menu.href} className="text-sm">
              {menu.label}
            </HeaderLink>
          ))}
        </div>
        <CustomButton
          className="md:hidden"
          onClick={handleMenu}
          aria-label="메뉴 열기/닫기"
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </CustomButton>
      </div>
      <div
        className={clsx(
          "space-y-4 md:hidden transition-[max-height] duration-500 ease-in-out overflow-hidden",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        {menuItems.map((menu) => (
          <HeaderLink
            key={menu.href}
            href={menu.href}
            className="w-full text-sm"
          >
            {menu.label}
          </HeaderLink>
        ))}
      </div>
    </nav>
  );
};

export default Header;
