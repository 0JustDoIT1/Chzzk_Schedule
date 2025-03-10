import { Option } from "@/types/option";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";

const useDropdown = (
  selected: Option,
  setSelected: React.Dispatch<React.SetStateAction<Option>>
) => {
  const router = useRouter();
  const pathName = usePathname();

  const dropdownRef = useRef<HTMLButtonElement>(null);
  const [dropdown, setDropdown] = useState<boolean>(false);

  // toggle dropdown
  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  // dropdown click event
  useEffect(() => {
    document.addEventListener("click", handleMouseEvent);
    return () => document.removeEventListener("click", handleMouseEvent);
  }, [dropdown]);

  // dropdown event with ref
  const handleMouseEvent = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent> | globalThis.MouseEvent
  ) => {
    if (e && e.target === dropdownRef.current) {
      toggleDropdown();
    } else {
      setDropdown(false);
    }
  };

  const selectOption = (item: Option) => {
    setSelected(item);
    setDropdown(false);
  };

  return {
    dropdownRef,
    dropdown,
    selectOption,
  };
};

export default useDropdown;
