import {
  AllCategory,
  BaseCategory,
  ChzzkCategory,
} from "@/schemas/schedule.schema";
import { IOption } from "@/lib/types/optionType";

export const BaseCategoryLabel = {
  [BaseCategory.PERSONAL]: "개인",
  [BaseCategory.TOGETHER]: "합방",
  [BaseCategory.CONTENT]: "컨텐츠",
  [BaseCategory.MATCH]: "대회",
} as const;

export const ChzzkCategoryLabel = {
  [ChzzkCategory.OFFICIAL]: "공식 컨텐츠",
  [ChzzkCategory.WATCH]: "같이 보기",
} as const;

export const baseCategoryOpt: IOption[] = [
  {
    value: BaseCategory.PERSONAL,
    label: BaseCategoryLabel[BaseCategory.PERSONAL],
  },
  {
    value: BaseCategory.TOGETHER,
    label: BaseCategoryLabel[BaseCategory.TOGETHER],
  },
  {
    value: BaseCategory.CONTENT,
    label: BaseCategoryLabel[BaseCategory.CONTENT],
  },
  {
    value: BaseCategory.MATCH,
    label: BaseCategoryLabel[BaseCategory.MATCH],
  },
];

export const chzzkCategoryOpt: IOption[] = [
  {
    value: ChzzkCategory.OFFICIAL,
    label: ChzzkCategoryLabel[ChzzkCategory.OFFICIAL],
  },
  {
    value: ChzzkCategory.WATCH,
    label: ChzzkCategoryLabel[ChzzkCategory.WATCH],
  },
];

export const AllCategoryLabel: Record<AllCategory, string> = {
  ...BaseCategoryLabel,
  ...ChzzkCategoryLabel,
};

export const categoryStyleMap: Record<
  AllCategory,
  { bg: string; text: string; border: string; hover: string }
> = {
  [AllCategory.PERSONAL]: {
    bg: "bg-yellow-600",
    text: "text-white",
    border: "border-yellow-600",
    hover: "hover:bg-yellow-100",
  },
  [AllCategory.TOGETHER]: {
    bg: "bg-purple-600",
    text: "text-white",
    border: "border-purple-600",
    hover: "hover:bg-purple-100",
  },
  [AllCategory.CONTENT]: {
    bg: "bg-teal-600",
    text: "text-white",
    border: "border-teal-600",
    hover: "hover:bg-teal-100",
  },
  [AllCategory.MATCH]: {
    bg: "bg-pink-600",
    text: "text-white",
    border: "border-pink-600",
    hover: "hover:bg-pink-100",
  },
  [AllCategory.OFFICIAL]: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-500",
    hover: "hover:bg-green-100",
  },
  [AllCategory.WATCH]: {
    bg: "bg-green-400",
    text: "text-white",
    border: "border-green-400",
    hover: "hover:bg-green-100",
  },
};
