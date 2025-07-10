import { IStringIndexable } from "@/lib/types/indexableType";
import clsx from "clsx";

interface ISearchableDropdownItem<T> {
  filterList: T[];
  keyName: string;
  value: string;
  selectIndex: number;
  selectItem: (item: T) => void;
  onChange: (...event: any[]) => void;
  itemRef: React.RefObject<HTMLUListElement | null>;
}

const SearchableDropdownItem = <T extends IStringIndexable>({
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
        const isSelected = value === item[keyName];
        const isHovered = index === selectIndex;

        const liClass = clsx("p-2 box-border cursor-pointer truncate", {
          "bg-brandSuperLight hover:bg-brandLight": isSelected && !isHovered,
          "bg-brandLight": isSelected && isHovered,
          "bg-white hover:bg-textBlur": !isSelected && !isHovered,
          "bg-textBlur": !isSelected && isHovered,
        });

        return (
          <li
            key={item._id}
            className={liClass}
            onClick={() => {
              selectItem(item);
              onChange(item[keyName]);
            }}
          >
            {item[keyName]}
          </li>
        );
      })}
    </ul>
  );
};

export default SearchableDropdownItem;
