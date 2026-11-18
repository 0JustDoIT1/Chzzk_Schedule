import {
  AllCategoryLabel,
  categoryStyleMap,
} from "@/lib/constants/streamingCategory";
import { AllCategory } from "@shared/constants";
import clsx from "clsx";

interface CategoryTagProps {
  category: AllCategory;
  className?: string;
}

const CategoryTag = ({ category, className = "text-xs" }: CategoryTagProps) => {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2.5 py-1 font-semibold",
        className,
        categoryStyleMap[category].bg,
        categoryStyleMap[category].text,
        categoryStyleMap[category].border
      )}
    >
      {AllCategoryLabel[category]}
    </span>
  );
};

export default CategoryTag;
