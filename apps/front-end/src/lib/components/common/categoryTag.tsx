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
        "px-2 py-1 rounded-full font-medium",
        className,
        categoryStyleMap[category].bg,
        categoryStyleMap[category].text
      )}
    >
      {AllCategoryLabel[category]}
    </span>
  );
};

export default CategoryTag;
