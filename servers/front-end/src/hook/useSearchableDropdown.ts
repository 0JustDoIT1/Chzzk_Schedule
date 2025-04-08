import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";

const useSearchableDropdown = (
  list: any[],
  keyName: string,
  value: string,
  onChange: (...event: any[]) => void
) => {
  const [query, setQuery] = useState<string>("");
  const [filterList, setFilterList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLUListElement>(null);

  // toggle list click event
  useEffect(() => {
    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  // Get list by input query
  useEffect(() => {
    const filter = list.filter(
      (item) => item[keyName].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
    setFilterList(filter);
  }, [query]);

  // When the list is closed, verify the result
  useEffect(() => {
    if (!isOpen && !value) {
      setQuery("");
    }
  }, [isOpen, value]);

  // toggle dropdown event with ref
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

  // Select list item -> result
  const selectItem = (item: any) => {
    setQuery("");
    onChange(item[keyName]);
    setIsOpen(false);
  };

  // display value
  const displayValue = () => {
    if (query) return query;
    if (value) return value;

    return "";
  };

  // Keyboard press event
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

  // keyboard scroll event
  const setKeyboardScroll = () => {
    const result = itemRef.current?.querySelector(".bg-textBlur");
    result?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return {
    inputRef,
    itemRef,
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
    displayValue,
  };
};

export default useSearchableDropdown;
