export const queryKeys = {
  getAllStreamerList: ["getAllStreamerList"],
  getScheduleById: (id: string) => ["getScheduleById", id],
  getScheduleListByDate: (date: Date) => ["getScheduleListByDate", date],
  getScheduleListByMonth: (month: Date) => ["getScheduleListByDate", month],
};
