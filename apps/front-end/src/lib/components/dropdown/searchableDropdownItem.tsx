import clsx from "clsx";

interface ISearchableDropdownItem<T extends { name: string; _id?: string }> {
  filterList: T[];
  keyName: keyof T;
  value: string;
  selectIndex: number;
  selectItem: (item: T) => void;
  onChange: (value: string) => void;
  itemRef: React.RefObject<HTMLUListElement | null>;
}

const SearchableDropdownItem = <T extends { name: string; _id?: string }>({
  filterList,
  keyName,
  value,
  selectIndex,
  selectItem,
  onChange,
  itemRef,
}: ISearchableDropdownItem<T>) => {
  return (
    <ul
      ref={itemRef}
      className="absolute start-0 z-10 w-full max-h-64 overflow-y-auto box-border rounded-md bg-white text-sm ring-1 shadow-lg ring-textLight "
    >
      {filterList.map((item, index) => {
        const isSelected = value === String(item[keyName]);
        const isHovered = index === selectIndex;

        const liClass = clsx("p-2 box-border cursor-pointer truncate", {
          "bg-brandSuperLight hover:bg-brandLight": isSelected && !isHovered,
          "bg-brandLight": isSelected && isHovered,
          "bg-white hover:bg-textBlur": !isSelected && !isHovered,
          "bg-textBlur": !isSelected && isHovered,
        });

        return (
          <li
            key={item._id ?? item.name}
            className={liClass}
            onClick={() => {
              selectItem(item);
              onChange(String(item[keyName]));
            }}
          >
            {String(item[keyName])}
          </li>
        );
      })}
    </ul>
  );
};

export default SearchableDropdownItem;
