export const queryKeys = {
  getAllStreamerList: ["getAllStreamerList"],
  getStreamerById: (id: string) => ["getStreamerById", id],
  getStreamerByName: (name: string) => ["getStreamerByName", name],
  getScheduleById: (id: string) => ["getScheduleById", id],
  getScheduleListByDate: (date: Date) => ["getScheduleListByDate", date],
  getScheduleListByMonth: (month: Date) => ["getScheduleListByMonth", month],
  getScheduleListByMonthWithId: (month: Date, id: string) => [
    "getScheduleListByMonthWithId",
    month,
    id,
  ],
  getScheduleListByMonthWithName: (month: Date, name: string) => [
    "getScheduleListByMonthWithName",
    month,
    name,
  ],
  getOfficialScheduleListByMonth: (month: Date) => [
    "getOfficialScheduleListByMonth",
    month,
  ],
  getScheduleLinkById: (id: string) => ["getScheduleLinkById", id],
};
