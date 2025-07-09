export const queryKeys = {
  getAllStreamerList: ["getAllStreamerList"],
  getStreamerById: (id: string) => ["getStreamerById", id],
  getScheduleById: (id: string) => ["getScheduleById", id],
  getScheduleListByDate: (date: Date) => ["getScheduleListByDate", date],
  getScheduleListByMonth: (month: Date) => ["getScheduleListByMonth", month],
  getScheduleLinkById: (id: string) => ["getScheduleLinkById", id],
};
