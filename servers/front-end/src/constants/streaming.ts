import { BaseCategory, ChzzkCategory } from "@/schemas/schedule.schema";
import { IOption } from "@/types/optionType";

export const BaseCategoryLabel: { [key: string]: string } = {
  [BaseCategory.PERSONAL]: "개인",
  [BaseCategory.TOGETHER]: "합방",
  [BaseCategory.CONTENT]: "컨텐츠",
  [BaseCategory.MATCH]: "대회",
};

export const ChzzkCategoryLabel: { [key: string]: string } = {
  [ChzzkCategory.OFFICIAL]: "공식 컨텐츠",
  [ChzzkCategory.WATCH]: "같이 보기",
};

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

export const categoryJson = () => {
  const allCategory = [...baseCategoryOpt, ...chzzkCategoryOpt];

  const result: { [x: string]: string } = {};
  allCategory.forEach((item) => (result[item.value] = item.label));

  return result;
};
