export const getInitials = (name: string) => {
  const str = name;
  const cho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 0xac00 && charCode <= 0xd7a3) {
      const uni = charCode - 0xac00;
      const choIdx = Math.floor(uni / (21 * 28));
      result += cho[choIdx];
    } else {
      result += str[i];
    }
  }
  return result;
};
