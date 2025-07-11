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
import Image from "next/image";

const Header = () => {
  const pathName = usePathname();

  /** save asPath state(previous, current) */
  const setAsPathData = useAsPathStore((state) => state.setAsPathData);
  /** handle header menu */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setAsPathData(pathName);
  }, [pathName, setAsPathData]);

  const handleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 p-4 text-gray-300 backdrop-blur-md shadow-md min-h-[72px]">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 md:container lg:max-w-6xl">
        <div className="flex items-center space-x-4 text-xl font-bold text-gray-100">
          <HeaderLink href={route.index} className="text-lg">
            <Image
              src="/assets/images/logo-kr.png"
              alt="0's Life 로고"
              width={100}
              height={50}
              className="mr-2 w-[80px] h-[40px] md:w-[100px] md:h-[50px]"
              priority
            />
          </HeaderLink>
        </div>
        <div className="hidden items-center space-x-12 md:flex">
          {menuItems.map((menu) => (
            <HeaderLink
              key={menu.href}
              href={menu.href}
              className="text-sm hover:text-white transition-colors"
            >
              {menu.label}
            </HeaderLink>
          ))}
        </div>
        <CustomButton
          className="md:hidden"
          onClick={handleMenu}
          aria-label="메뉴 열기/닫기"
        >
          <MenuIcon className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
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
            className="w-full text-sm text-gray-300 hover:text-white block px-4 py-2"
          >
            {menu.label}
          </HeaderLink>
        ))}
      </div>
    </nav>
  );
};

export default Header;
