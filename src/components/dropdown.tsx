import useDropdown from "@/hook/useDropdown";
import { Option } from "@/types/option";
import CheckIcon from "~/public/assets/svg/check";
import ChevronDownIcon from "~/public/assets/svg/chevron-down";

interface CustomDropdown {
  option: Option[];
  selected: Option;
  setSelected: React.Dispatch<React.SetStateAction<Option>>;
}

const CustomDropdown = ({ option, selected, setSelected }: CustomDropdown) => {
  const { dropdownRef, dropdown, selectOption } = useDropdown(
    selected,
    setSelected
  );

  return (
    <div className="relative inline-block">
      <button
        ref={dropdownRef}
        className="inline-flex items-center justify-center max-w-64 gap-x-1.5 rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-textLight ring-inset bg-white text-textMain mr-2 hover:bg-textHover"
      >
        {selected.label}
        <ChevronDownIcon className="w-4 h-4 text-textNormal pointer-events-none" />
      </button>
      {dropdown && (
        <div className="absolute left-0 z-10 mt-1 w-36 origin-top-left rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden">
          <ul className="py-1 rounded-md ring-1 ring-textSuperLight ring-inset">
            {option.map((item) => (
              <li
                key={item.value}
                className="flex items-center px-4 py-2 text-sm text-textMain cursor-default hover:bg-textBlur"
                onClick={() => selectOption(item)}
              >
                {selected.value === item.value ? (
                  <span className="w-4 mr-2">
                    <CheckIcon className="w-4 h-4 text-textMain" />
                  </span>
                ) : (
                  <span className="w-4 mr-2"></span>
                )}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
