import ScheduleDetailView from "@/screens/schedule/scheduleDetail";

interface ITodayIdPage {
  params: { id: string };
}

const TodayIdPage = async ({ params }: ITodayIdPage) => {
  const { id } = await params;

  return <ScheduleDetailView id={id} />;
};

export default TodayIdPage;
