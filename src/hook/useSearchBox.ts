import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";

const useSearchBox = (
  list: any[],
  keyName: string,
  result: string[],
  setResult: React.Dispatch<React.SetStateAction<string[]>>
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
    if (!result.includes(item[keyName])) setResult([...result, item[keyName]]);
    setIsOpen(false);
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
    const result = itemRef.current?.querySelector(".bg-gray-100");
    result?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // When the list is closed, verify the result
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

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
  };
};

export default useSearchBox;
