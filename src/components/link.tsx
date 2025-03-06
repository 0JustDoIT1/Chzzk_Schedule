import Link from "next/link";
import { ReactNode } from "react";

interface BrandLink {
  children: ReactNode;
  color?: string;
  classes?: string;
  href: string;
  scroll?: boolean;
}

export const BrandLink = ({
  children,
  color,
  classes,
  href,
  scroll = false,
}: BrandLink) => {
  const className = `inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${classes}`;

  return (
    <Link href={href} className={className} scroll={scroll}>
      {children}
    </Link>
  );
};

export const HeaderLink = ({ children, classes, href }: BrandLink) => {
  const className = `inline-flex items-center justify-center whitespace-nowrap h-10 py-2 ${classes}`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
