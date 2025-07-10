import { dateTypeToDate } from "./dateFormat";

// export const sorting = (array: any[], sort: number, option?: string) => {
//   return array.sort((a, b) => {
//     let newA;
//     let newB;

//     if (option) {
//       if (option === "startAt") {
//         newA = dateTypeToDate(a[option]);
//         newB = dateTypeToDate(b[option]);
//       } else {
//         newA = a[option];
//         newB = b[option];
//       }
//     } else {
//       newA = a;
//       newB = b;
//     }

//     if (sort === 1) return newA - newB;
//     else return newB - newA;
//   });
// };

type SortOrder = 1 | -1;

export function sorting<T>(
  array: T[],
  sortOrder: SortOrder,
  key?: keyof T
): T[] {
  return [...array].sort((a, b) => {
    let valA = key ? a[key] : a;
    let valB = key ? b[key] : b;

    let compareA: any = valA;
    let compareB: any = valB;

    // 날짜 문자열 처리
    if (key === "startAt" || key === "endAt") {
      compareA = dateTypeToDate(valA as string);
      compareB = dateTypeToDate(valB as string);
    }

    // 숫자/날짜 비교
    if (compareA instanceof Date && compareB instanceof Date) {
      return sortOrder === 1
        ? compareA.getTime() - compareB.getTime()
        : compareB.getTime() - compareA.getTime();
    }

    // 숫자 비교
    if (typeof compareA === "number" && typeof compareB === "number") {
      return sortOrder === 1 ? compareA - compareB : compareB - compareA;
    }

    // 문자열 비교
    if (typeof compareA === "string" && typeof compareB === "string") {
      return sortOrder === 1
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    }

    // fallback
    return 0;
  });
}
