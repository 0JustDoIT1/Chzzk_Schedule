import { MouseEvent, useEffect, useRef, useState } from "react";
import ChevronDownIcon from "~/public/assets/svg/chevron-down";
import ChevronUpIcon from "~/public/assets/svg/chevron-up";

interface SearchableDropdown {
  list: any[];
  label: string;
  selectedVal: string | null;
  handleChange: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchableDropdown = ({
  list,
  label,
  selectedVal,
  handleChange,
}: SearchableDropdown) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  const selectItem = (item: any) => {
    setQuery("");
    handleChange(item[label]);
    setIsOpen(false);
  };

  const toggleDropdown = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent> | globalThis.MouseEvent
  ) => {
    console.log("hi");
    if (e && e.target === inputRef.current) setIsOpen(true);
    else setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (list: any[]) => {
    return list.filter(
      (item) => item[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="relative cursor-default">
      <input
        className=" w-64 rounded-md bg-white p-2 text-sm text-gray-900 box-border ring-1 shadow-xs ring-gray-300  outline-none hover:bg-gray-50"
        ref={inputRef}
        type="text"
        value={getDisplayValue()}
        name="searchValue"
        onChange={(e) => {
          setQuery(e.target.value);
          handleChange(null);
        }}
        onClick={toggleDropdown}
      />
      {isOpen ? (
        <ChevronUpIcon className="absolute top-1.5 right-0 w-6 h-6 text-gray-600" />
      ) : (
        <ChevronDownIcon className="absolute top-1.5 right-0 w-6 h-6 text-gray-600" />
      )}

      {isOpen && filter(list).length > 0 && (
        <div className="absolute start-0 z-10 w-64 max-h-64 overflow-y-auto box-border rounded-md bg-white text-sm ring-1 shadow-lg ring-gray-300 ">
          {filter(list).map((item) => {
            return (
              <div
                key={item._id}
                className="p-2 box-border cursor-pointer hover:bg-gray-100"
                onClick={() => selectItem(item)}
              >
                {item[label]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
