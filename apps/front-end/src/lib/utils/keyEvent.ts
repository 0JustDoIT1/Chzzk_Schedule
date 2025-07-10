import { KeyboardEvent } from "react";

export const preventEnterKey = (e: KeyboardEvent<HTMLElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};
