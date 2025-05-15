import { KeyboardEvent } from "react";

export const preventEnterKey = (e: KeyboardEvent<HTMLElement>) => {
  if (e.code === "Enter") {
    e.preventDefault();
  }
};
