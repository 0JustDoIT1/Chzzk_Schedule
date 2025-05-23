import { getScheduleListByDate } from "@/api/schedule-api";
import MainView from "@/screens/main";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/utils/dateFormat";

const MainPage = async () => {
  const today = dateToFormatString(getToday(), "YYYY-MM-DD");
  const date = dateTypeToDate(today);
  const scheduleList = await getScheduleListByDate(date);

  console.log("!!!", scheduleList);

  return <MainView scheduleList={scheduleList} />;
};

export default MainPage;
