import { useState } from "react";

export const useMember = (initial: string[]) => {
  const [member, setMember] = useState(initial);
  const addMember = (name: string) => {
    if (name && !member.includes(name)) {
      setMember((prev) => [...prev, name]);
    }
  };
  const removeMember = (name: string) =>
    setMember((prev) => prev.filter((m) => m !== name));

  const resetMember = () => setMember(initial);

  return { member, setMember, addMember, removeMember, resetMember };
};
