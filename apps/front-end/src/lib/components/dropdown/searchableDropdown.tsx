import useSearchableDropdown from "@/lib/hook/useSearchableDropdown";
import type { StringIndexable } from "@/lib/types/indexableType";
import clsx from "clsx";
import React from "react";
import { RefCallBack } from "react-hook-form";
import ChevronDownIcon from "~/public/assets/svg/chevron-down";
import ChevronUpIcon from "~/public/assets/svg/chevron-up";
import SearchableDropdownItem from "./searchableDropdownItem";

interface ISearchableDropdown<T> {
  list: T[];
  keyName: string;
  placeholder: string;
  ref?: RefCallBack;
  value: string;
  onChange: (...event: any[]) => void;
  errors: boolean;
}

const SearchableDropdown = <T extends StringIndexable>({
  list,
  keyName,
  placeholder,
  ref,
  value,
  onChange,
  errors,
}: ISearchableDropdown<T>) => {
  const {
    inputRef,
    itemRef,
    setQuery,
    filterList,
    isOpen,
    setIsOpen,
    selectIndex,
    setSelectIndex,
    toggleDropdown,
    onKeyPress,
    selectItem,
    displayValue,
  } = useSearchableDropdown(list, keyName, value, onChange);

  return (
    <div className="relative cursor-default">
      <input
        id={keyName}
        className={clsx(
          "w-full rounded-md bg-white p-2 text-sm text-textMain box-border ring-1 shadow-xs outline-none hover:bg-textHover",
          errors
            ? "ring-error focus:ring-2 focus:ring-error"
            : "ring-textLight focus:ring-brandMain"
        )}
        name={keyName}
        ref={(e) => {
          inputRef.current = e;
          ref?.(e);
        }}
        type="text"
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange("");
          setIsOpen(true);
          setSelectIndex(0);
        }}
        onClick={toggleDropdown}
        onKeyDown={onKeyPress}
      />
      {isOpen && filterList.length > 0 ? (
        <ChevronUpIcon className="absolute top-1.5 right-0 w-6 h-6 text-textNormal pointer-events-none" />
      ) : (
        <ChevronDownIcon className="absolute top-1.5 right-0 w-6 h-6 text-textNormal pointer-events-none" />
      )}

      {isOpen && filterList.length > 0 && (
        <SearchableDropdownItem
          filterList={filterList}
          keyName={keyName}
          value={value}
          selectIndex={selectIndex}
          selectItem={selectItem}
          onChange={onChange}
          itemRef={itemRef}
        />
      )}
    </div>
  );
};

export default SearchableDropdown;
