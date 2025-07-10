import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { IStringIndexable } from "@/lib/types/indexableType";

const useSearchableDropdown = <T extends IStringIndexable>(
  list: T[],
  keyName: string,
  value: string,
  onChange: (value: string) => void
) => {
  const [query, setQuery] = useState<string>("");
  const [filterList, setFilterList] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLUListElement>(null);

  // keyboard scroll
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setKeyboardScroll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectIndex]);

  // toggle dropdown event with ref
  const toggleDropdown = useCallback(
    (
      e: MouseEvent<HTMLElement, globalThis.MouseEvent> | globalThis.MouseEvent
    ) => {
      if (e && e.target === inputRef.current) {
        setIsOpen(true);
        setSelectIndex(0);
      } else {
        setIsOpen(false);
        setSelectIndex(0);
      }
    },
    [inputRef, setIsOpen, setSelectIndex]
  );

  // toggle list click event
  useEffect(() => {
    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, [toggleDropdown]);

  // Get list by input query
  useEffect(() => {
    const filter = list.filter(
      (item) => item[keyName].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
    setFilterList(filter);
  }, [list, keyName, query]);

  // When the list is closed, verify the result
  useEffect(() => {
    if (!isOpen && !value) {
      setQuery("");
    }
  }, [isOpen, value]);

  // Select list item -> result
  const selectItem = (item: T) => {
    setQuery("");
    onChange(item[keyName]);
    setIsOpen(false);
  };

  // display value
  const displayValue = useMemo(() => {
    if (query) return query;
    if (value) return value;
    return "";
  }, [query, value]);

  // Keyboard press event
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const length = filterList.length;
    if (isOpen && length > 0 && e.key === "ArrowDown") {
      setSelectIndex((selectIndex + 1) % length);
    }
    if (isOpen && length > 0 && e.key === "ArrowUp") {
      if (selectIndex === 0) setSelectIndex(length - 1);
      else setSelectIndex(selectIndex - 1);
    }

    if (e.key === "Enter") {
      if (isOpen && length > 0) {
        const item = filterList[selectIndex];
        if (item) selectItem(item);
      } else {
        setIsOpen(false);
      }
    }
  };

  // keyboard scroll event
  const setKeyboardScroll = useCallback(() => {
    const result = itemRef.current?.querySelector(".bg-textBlur");
    result?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

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
