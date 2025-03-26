import { dateTypeToDate } from "./dateFormat";

// export const sorting = (a: any, b: any, sort: number, option?: string) => {
//   let newA;
//   let newB;

//   if (option) {
//     if (option === "startAt") {
//       newA = dateTypeToDate(a[option]);
//       newB = dateTypeToDate(b[option]);
//     } else {
//       newA = a[option];
//       newB = b[option];
//     }
//   } else {
//     newA = a;
//     newB = b;
//   }

//   if (sort === 1) return newA - newB;
//   else return newB - newA;
// };

export const sorting = (array: any[], sort: number, option?: string) => {
  return array.sort((a, b) => {
    let newA;
    let newB;

    if (option) {
      if (option === "startAt") {
        newA = dateTypeToDate(a[option]);
        newB = dateTypeToDate(b[option]);
      } else {
        newA = a[option];
        newB = b[option];
      }
    } else {
      newA = a;
      newB = b;
    }

    if (sort === 1) return newA - newB;
    else return newB - newA;
  });
};
