import { getScheduleListByDate } from "@/api/schedule-api";
import MainView from "@/screens/main";
import {
  dateToFormatString,
  dateTypeToDate,
  getToday,
} from "@/lib/utils/dateFormat";

const MainPage = async () => {
  const today = dateToFormatString(getToday(), "YYYY-MM-DD");
  const date = dateTypeToDate(today);
  const scheduleList = await getScheduleListByDate(date);

  // provider 및 세팅 필요
  console.log("!!!", scheduleList);

  return <MainView scheduleList={scheduleList} />;
};

export default MainPage;
