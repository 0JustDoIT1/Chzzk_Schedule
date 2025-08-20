import ScheduleDetailView from "@/lib/screens/schedule/scheduleDetail";

interface IDetailIdPage {
  params: Promise<{ id: string }>;
}

const DetailIdPage = async ({ params }: IDetailIdPage) => {
  const { id } = await params;

  return <ScheduleDetailView id={id} />;
};

export default DetailIdPage;
