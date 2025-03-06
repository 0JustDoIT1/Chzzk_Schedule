import { ReactNode } from "react";

interface HelperText {
  className: string;
  children: ReactNode;
}

const HelperText = ({ className, children }: HelperText) => {
  return <p className={`mt-1 text-xs ${className}`}>{children}</p>;
};

export default HelperText;
