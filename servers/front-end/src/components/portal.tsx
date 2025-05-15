import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface IPortal {
  children: ReactNode;
}

function Portal({ children }: IPortal) {
  const element =
    typeof window !== "undefined" &&
    (document.getElementById("portal") as HTMLElement);

  if (!element) return null;

  return ReactDOM.createPortal(children, element);
}

export default Portal;
