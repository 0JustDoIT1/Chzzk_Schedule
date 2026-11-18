import clsx from "clsx";

interface CalendarHeaderRowProps {
  weekHeader: string[];
}

const CalendarHeaderRow = ({ weekHeader }: CalendarHeaderRowProps) => {
  const baseWeekClass =
    "h-11 leading-[44px] text-center text-xs font-semibold border-b border-gray-200 bg-gray-50";
  return (
    <div className="grid grid-cols-7 divide-x divide-gray-100">
      {weekHeader.map((item, index) => (
        <div
          key={item}
          className={clsx(baseWeekClass, {
            "text-red-600": index === 0,
            "text-blue-600": index === 6,
            "text-textMain": index !== 0 && index !== 6,
          })}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeaderRow;
