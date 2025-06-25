import clsx from "clsx";
import { ReactNode } from "react";

interface IBrandButton {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const CustomButton = ({
  children,
  className,
  type = "button",
  onClick,
}: IBrandButton) => {
  return (
    <button type={type} className={clsx("", className)} onClick={onClick}>
      {children}
    </button>
  );
};

export const BrandButton = ({
  children,
  color,
  className,
  type = "button",
  onClick,
}: IBrandButton) => {
  let colorName = "";

  switch (color) {
    case "green":
      colorName = "bg-brandMain text-white hover:bg-brandMainHover";
      break;

    default:
      colorName = "bg-white text-textMain hover:bg-textHover";
      break;
  }

  const addClass = `${colorName} ${className}`;

  return (
    <button
      type={type}
      className={clsx(
        "inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-textLight ring-inset",
        addClass
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
