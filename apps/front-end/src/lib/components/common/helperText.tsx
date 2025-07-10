import { ReactNode } from "react";

interface IHelperText {
  className: string;
  children: ReactNode;
}

const HelperText = ({ className, children }: IHelperText) => {
  return <p className={`mt-1 text-xs ${className}`}>{children}</p>;
};

export default HelperText;
