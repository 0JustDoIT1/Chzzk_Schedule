import { PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Portal({ children }: PropsWithChildren) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("portal");
    setElement(el);
  }, []);

  if (!element) return null;

  return ReactDOM.createPortal(children, element);
}

export default Portal;
