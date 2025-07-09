import Link from "next/link";
import ArrowUpRightFromSquareIcon from "~/public/assets/svg/arrow-up-right-from-square";

const ChzzkLink = ({ name, url }: { name: string; url: string }) => (
  <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
    <p className="text-base font-medium text-textMain">{name}</p>
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm text-brandMain hover:underline"
    >
      채널 보기
      <ArrowUpRightFromSquareIcon className="w-4 h-4" />
    </Link>
  </div>
);

export default ChzzkLink;
