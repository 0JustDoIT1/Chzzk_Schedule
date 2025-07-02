import { useState } from "react";
import { TToastType } from "../types/toastType";

export const useMember = (
  initial: string[],
  showToast: (type: TToastType, message: string) => void,
  streamerName?: string
) => {
  const [member, setMember] = useState(initial);
  const addMember = (name: string) => {
    if (name === streamerName) {
      showToast(
        "warning",
        "스트리머와 동일한 이름은 멤버로 추가할 수 없습니다."
      );
      return;
    }

    if (name && !member.includes(name) && name !== streamerName) {
      setMember((prev) => [...prev, name]);
    }
  };
  const removeMember = (name: string) =>
    setMember((prev) => prev.filter((m) => m !== name));

  const resetMember = () => setMember(initial);

  return { member, setMember, addMember, removeMember, resetMember };
};
