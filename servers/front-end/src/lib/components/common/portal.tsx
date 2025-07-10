import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";

function Portal({ children }: PropsWithChildren) {
  const element =
    typeof window !== "undefined" &&
    (document.getElementById("portal") as HTMLElement);

  if (!element) return null;

  return ReactDOM.createPortal(children, element);
}

export default Portal;
