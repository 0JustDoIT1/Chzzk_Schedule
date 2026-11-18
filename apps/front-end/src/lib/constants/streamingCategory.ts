import { IOption } from "@/lib/types/optionType";
import { AllCategory, BaseCategory, ChzzkCategory } from "@shared/constants";

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
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
    hover: "hover:bg-amber-100",
  },
  [AllCategory.TOGETHER]: {
    bg: "bg-violet-50",
    text: "text-violet-900",
    border: "border-violet-200",
    hover: "hover:bg-violet-100",
  },
  [AllCategory.CONTENT]: {
    bg: "bg-cyan-50",
    text: "text-cyan-900",
    border: "border-cyan-200",
    hover: "hover:bg-cyan-100",
  },
  [AllCategory.MATCH]: {
    bg: "bg-rose-50",
    text: "text-rose-900",
    border: "border-rose-200",
    hover: "hover:bg-rose-100",
  },
  [AllCategory.OFFICIAL]: {
    bg: "bg-green-50",
    text: "text-green-900",
    border: "border-green-200",
    hover: "hover:bg-green-100",
  },
  [AllCategory.WATCH]: {
    bg: "bg-indigo-50",
    text: "text-indigo-900",
    border: "border-indigo-200",
    hover: "hover:bg-indigo-100",
  },
};
