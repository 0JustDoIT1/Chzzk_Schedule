import { route } from "@/lib/constants/router";
import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import PlusIcon from "~/public/assets/svg/plus";

interface IBrandLink {
  children: ReactNode;
  color?: string;
  className?: string;
  href: string;
  scroll?: boolean;
}

export const BrandLink = ({
  children,
  color,
  className,
  href,
  scroll = false,
}: IBrandLink) => {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-textMain shadow-sm ring-1 ring-inset ring-textLight hover:bg-textHover",
        className
      )}
      scroll={scroll}
    >
      {children}
    </Link>
  );
};

export const HeaderLink = ({ children, className, href }: IBrandLink) => {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap h-10 py-2",
        className
      )}
    >
      {children}
    </Link>
  );
};

export const AddScheduleLink = ({ className }: { className: string }) => {
  return (
    <BrandLink href={route.scheduleAdd} className={clsx("", className)}>
      <PlusIcon className="w-4 h-4 text-textMain mt-[0.5]" />
      일정 추가
    </BrandLink>
  );
};
