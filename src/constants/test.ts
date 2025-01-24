export const TestTodayList = [
  {
    time: -1,
    list: [
      {
        _id: "1",
        title: "탬탬 겟투워크",
        member: ["탬탬"],
        startAt: new Date(),
      },
    ],
  },
  {
    time: 5,
    list: [
      {
        _id: "1",
        title: "동수칸 삼국지",
        member: ["한동숙"],
        startAt: new Date(),
      },
      {
        _id: "2",
        title: "실프 발로란트",
        member: ["실프", "김뚜띠"],
        startAt: new Date(),
      },
    ],
  },
  {
    time: 6,
    list: [
      {
        _id: "3",
        title: "산악회",
        member: [
          "한동숙",
          "삼식",
          "괴물쥐",
          "포셔",
          "다주",
          "이초홍",
          "노돌리",
          "명훈",
        ],
        startAt: new Date(),
      },
    ],
  },
];

export const TestDayList = [
  {
    day: "2025-01-24",
    preList: [],
    list: [
      {
        _id: "1",
        title: "실프 발로란트",
        member: ["실프", "김뚜띠"],
        startAt: new Date(),
        endAt: new Date("2025-01-27"),
      },
      {
        _id: "2",
        title: "탬탬 발로란트",
        member: ["탬탬버린", "이춘향"],
        startAt: new Date(),
        endAt: new Date(),
      },
      {
        _id: "3",
        title: "나나양 배틀그라운드",
        member: ["나나양"],
        startAt: new Date(),
        endAt: new Date(),
      },
      {
        _id: "4",
        title: "김진우 테트리스",
        member: ["김진우", "모라라"],
        startAt: new Date(),
        endAt: new Date(),
      },
      {
        _id: "6",
        title: "픽셀 노래맞추기",
        member: ["김진우", "김뿡", "너불", "아구이뽀"],
        startAt: new Date(),
        endAt: new Date(),
      },
    ],
  },
  {
    day: "2025-01-25",
    preList: [
      {
        _id: "1",
        title: "실프 발로란트",
        member: ["실프", "김뚜띠"],
        startAt: new Date(),
        endAt: new Date("2025-01-26"),
      },
    ],
    list: [
      {
        id: "5",
        title: "한동숙 삼국지",
        member: ["한동숙"],
        startAt: new Date("2025-01-25"),
        endAt: new Date("2025-01-26"),
      },
    ],
  },
  {
    day: "2025-01-26",
    preList: [
      {
        _id: "1",
        title: "실프 발로란트",
        member: ["실프", "김뚜띠"],
        startAt: new Date(),
        endAt: new Date("2025-01-28"),
      },
      {
        id: "5",
        title: "한동숙 삼국지",
        member: ["한동숙"],
        startAt: new Date("2025-01-25"),
        endAt: new Date("2025-01-26"),
      },
    ],
    list: [],
  },
];
