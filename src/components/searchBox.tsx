import useSearchBox from "@/hook/useSearchBox";
import { CustomButton } from "./button";
import CloseIcon from "~/public/assets/svg/close";
import SearchIcon from "~/public/assets/svg/search";

interface SearchBox {
  list: any[];
  keyName: string;
  placeholder: string;
  result: string[];
  setResult: React.Dispatch<React.SetStateAction<string[]>>;
}

const SearchBox = ({
  list,
  keyName,
  placeholder,
  result,
  setResult,
}: SearchBox) => {
  const {
    inputRef,
    itemRef,
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
  } = useSearchBox(list, keyName, result, setResult);

  return (
    <div className="relative cursor-default">
      <input
        id={keyName}
        className="w-full rounded-md bg-white py-2 pl-2 pr-16 text-sm text-textMain box-border ring-1 shadow-xs ring-textLight outline-none hover:bg-textHover focus:ring-brandMain focus:border-brandMain"
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectIndex(0);
        }}
        onClick={toggleDropdown}
        onKeyDown={onKeyPress}
      />
      {query && (
        <CustomButton
          classes="absolute top-2.5 right-10 flex items-center justify-center w-4 h-4 rounded-full bg-textIcon"
          onClick={() => setQuery("")}
        >
          <CloseIcon className="w-3 h-3 text-white" />
        </CustomButton>
      )}
      <SearchIcon className="absolute top-2 right-2 w-5 h-5 text-textIcon pointer-events-none" />

      {isOpen && filterList.length > 0 && (
        <ul
          ref={itemRef}
          className="absolute start-0 z-10 w-full max-h-64 overflow-y-auto box-border rounded-md bg-white text-sm ring-1 shadow-lg ring-textLight "
        >
          {filterList.map((item, index) => {
            let background = "";
            let hover = "";

            if (result === item[keyName]) {
              hover = "hover:bg-brandLight";
              background = "bg-brandSuperLight";
              if (index === selectIndex) {
                background = "bg-brandLight";
              }
            } else {
              hover = "hover:bg-textBlur";
              background = "bg-white";
              if (index === selectIndex) {
                background = "bg-textBlur";
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
                }}
              >
                {item[keyName]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
