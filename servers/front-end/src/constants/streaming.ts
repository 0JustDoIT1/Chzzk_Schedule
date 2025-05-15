import { IOption } from "@/types/optionType";

export const category: IOption[] = [
  { value: "personal", label: "개인" },
  { value: "together", label: "합방" },
  { value: "content", label: "컨텐츠" },
  { value: "match", label: "대회" },
];

export const chzzkCategory: IOption[] = [
  { value: "official", label: "공식 컨텐츠" },
  { value: "watch", label: "같이 보기" },
];

export const categoryJson = () => {
  const allCategory = [...category, ...chzzkCategory];

  const result: { [x: string]: string } = {};
  allCategory.forEach((item) => (result[item.value] = item.label));

  return result;
};
