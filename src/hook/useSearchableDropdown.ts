import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";

const useSearchableDropdown = (list: any[], label: string) => {
  const [value, setValue] = useState<string>("");

  const [query, setQuery] = useState<string>("");
  const [filterList, setFilterList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  const selectItem = (item: any) => {
    setQuery(item[label]);
    setValue(item[label]);
    setIsOpen(false);
  };

  useEffect(() => {
    const filter = list.filter(
      (item) => item[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
    setFilterList(filter);
  }, [query]);

  const toggleDropdown = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent> | globalThis.MouseEvent
  ) => {
    if (e && e.target === inputRef.current) {
      setIsOpen(true);
      setSelectIndex(0);
    } else {
      setIsOpen(false);
      setSelectIndex(0);
    }
  };

  const onKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    const length = filterList.length;
    if (isOpen && length > 0 && e.code === "ArrowDown") {
      setSelectIndex((selectIndex + 1) % length);
    }
    if (isOpen && length > 0 && e.code === "ArrowUp") {
      if (selectIndex === 0) setSelectIndex(length - 1);
      else setSelectIndex(selectIndex - 1);
    }

    if (e.code === "Enter") {
      if (isOpen && length > 0) {
        const item = filterList[selectIndex];
        if (item) selectItem(item);
      } else {
        setIsOpen(false);
      }
    }
  };

  const setKeyboardScroll = () => {
    const selected = itemRef.current?.querySelector(".bg-gray-100");
    selected?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (!isOpen && !value) {
      setQuery("");
    }
    if (!isOpen && query !== value) {
      setQuery(value);
    }
  }, [isOpen]);

  return {
    inputRef,
    itemRef,
    value,
    setValue,
    query,
    setQuery,
    filterList,
    setFilterList,
    isOpen,
    setIsOpen,
    selectIndex,
    setSelectIndex,
    toggleDropdown,
    onKeyPress,
    setKeyboardScroll,
    selectItem,
  };
};

export default useSearchableDropdown;
