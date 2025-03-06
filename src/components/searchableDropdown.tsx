import useSearchableDropdown from "@/hook/useSearchableDropdown";
import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import ChevronDownIcon from "~/public/assets/svg/chevron-down";
import ChevronUpIcon from "~/public/assets/svg/chevron-up";
import HelperText from "./helperText";

interface SearchableDropdown {
  list: any[];
  keyName: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  errors: FieldErrors<FieldValues>;
  ringStyle: (name: string) => string;
}

const SearchableDropdown = ({
  list,
  keyName,
  placeholder,
  register,
  setValue,
  errors,
  ringStyle,
}: SearchableDropdown) => {
  const {
    inputRef,
    itemRef,
    result,
    setResult,
    query,
    setQuery,
    filterList,
    isOpen,
    setIsOpen,
    selectIndex,
    setSelectIndex,
    toggleDropdown,
    onKeyPress,
    setKeyboardScroll,
    selectItem,
    displayValue,
  } = useSearchableDropdown(list, keyName);

  const { ref, ...rest } = register(keyName, {
    required: { value: true, message: "스트리머를 선택해 주세요." },
  });

  return (
    <React.Fragment>
      <div className="relative cursor-default">
        <input
          {...rest}
          id={keyName}
          className={`w-full rounded-md bg-white p-2 text-sm text-gray-800 box-border ring-1 shadow-xs outline-none hover:bg-gray-50 ${ringStyle(
            keyName
          )}`}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          type="text"
          value={displayValue()}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setResult("");
            setIsOpen(true);
            setSelectIndex(0);
          }}
          onClick={toggleDropdown}
          onKeyDown={onKeyPress}
        />
        {isOpen && filterList.length > 0 ? (
          <ChevronUpIcon className="absolute top-1.5 right-0 w-6 h-6 text-gray-600 pointer-events-none" />
        ) : (
          <ChevronDownIcon className="absolute top-1.5 right-0 w-6 h-6 text-gray-600 pointer-events-none" />
        )}

        {isOpen && filterList.length > 0 && (
          <ul
            ref={itemRef}
            className="absolute start-0 z-10 w-full max-h-64 overflow-y-auto box-border rounded-md bg-white text-sm ring-1 shadow-lg ring-gray-300 "
          >
            {filterList.map((item, index) => {
              let background = "";
              let hover = "";

              if (result === item[keyName]) {
                hover = "hover:bg-green-300";
                background = "bg-green-200";
                if (index === selectIndex) {
                  background = "bg-green-300";
                }
              } else {
                hover = "hover:bg-gray-100";
                background = "bg-white";
                if (index === selectIndex) {
                  background = "bg-gray-100";
                }
              }
              setTimeout(() => {
                setKeyboardScroll();
              }, 100);

              return (
                <li
                  key={item._id}
                  className={`p-2 box-border cursor-pointer truncate ${background} ${hover}`}
                  onClick={() => {
                    selectItem(item);
                    setValue(keyName, item[keyName], { shouldValidate: true });
                  }}
                >
                  {item[keyName]}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {errors[keyName] && (
        <HelperText className="text-error">
          {errors[keyName]?.message as string}
        </HelperText>
      )}
    </React.Fragment>
  );
};

export default SearchableDropdown;
