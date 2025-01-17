"use client";

import MenuIcon from "assets/svg/menu";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 p-4 text-white backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 md:container lg:max-w-[1200px]">
        <div className="flex items-center space-x-4 text-xl font-bold">
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap text-lg h-10 py-2"
          >
            0's Life
          </Link>
        </div>
        <div className="hidden items-center space-x-12 mx-4 md:flex">
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2"
          >
            오늘
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2"
          >
            전체
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2"
          >
            스트리머별
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2"
          >
            공식방송
          </Link>
        </div>
        <button className="md:hidden" onClick={handleMenu}>
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <div
        className={`space-y-4 md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "h-52" : "h-0"
        }`}
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2 w-full"
        >
          오늘
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2 w-full"
        >
          전체
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2 w-full"
        >
          스트리머별
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 py-2 w-full"
        >
          공식방송
        </Link>
      </div>
    </nav>
  );
};

export default Header;
