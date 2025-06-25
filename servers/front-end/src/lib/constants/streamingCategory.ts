import { BaseCategory, ChzzkCategory } from "@/schemas/schedule.schema";
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

export const AllCategoryLabel: typeof BaseCategoryLabel &
  typeof ChzzkCategoryLabel = {
  ...BaseCategoryLabel,
  ...ChzzkCategoryLabel,
};

export const categoryColorMap: { [key: string]: string } = {
  personal: "text-yellow-800",
  together: "text-purple-800",
  content: "text-teal-800",
  match: "text-pink-800",
  official: "text-green-600",
  watch: "text-green-400",
};
