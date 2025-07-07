import ScheduleDetailView from "@/screens/schedule/scheduleDetail";

interface IDetailIdPage {
  params: { id: string };
}

const DetailIdPage = async ({ params }: IDetailIdPage) => {
  const { id } = await params;

  return <ScheduleDetailView id={id} />;
};

export default DetailIdPage;
