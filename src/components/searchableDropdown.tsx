import useSearchableDropdown from "@/hook/useSearchableDropdown";
import ChevronDownIcon from "~/public/assets/svg/chevron-down";
import ChevronUpIcon from "~/public/assets/svg/chevron-up";

interface SearchableDropdown {
  list: any[];
  label: string;
}

const SearchableDropdown = ({ list, label }: SearchableDropdown) => {
  const {
    inputRef,
    itemRef,
    value,
    setValue,
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
  } = useSearchableDropdown(list, label);

  return (
    <div className="relative cursor-default">
      <input
        className="w-full truncate rounded-md bg-white py-2 pl-2 pr-6 text-sm text-gray-800 box-border ring-1 shadow-xs ring-gray-300 outline-none hover:bg-gray-50 focus:ring-brandMain focus:border-brandMain"
        ref={inputRef}
        type="text"
        value={query}
        name="searchValue"
        placeholder="스트리머를 선택해 주세요"
        onChange={(e) => {
          setQuery(e.target.value);
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

            if (value === item[label]) {
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
                onClick={() => selectItem(item)}
              >
                {item[label]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
