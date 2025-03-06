import { ReactNode } from "react";

interface BrandButton {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  color?: string;
  classes?: string;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const CustomButton = ({
  children,
  classes,
  type = "button",
  onClick,
}: BrandButton) => {
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export const BrandButton = ({
  children,
  color,
  classes,
  type = "button",
  onClick,
}: BrandButton) => {
  let colorName = "";

  switch (color) {
    case "blue":
      colorName = "bg-green-500 text-white hover:bg-green-600";
      break;

    default:
      colorName = "bg-white text-gray-800 hover:bg-gray-50";
      break;
  }

  const className = `inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-gray-300 ring-inset ${colorName} ${classes}`;

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};
