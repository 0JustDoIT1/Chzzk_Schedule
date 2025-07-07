import clsx from "clsx";

interface CalendarHeaderRowProps {
  weekHeader: string[];
}

const CalendarHeaderRow = ({ weekHeader }: CalendarHeaderRowProps) => {
  const baseWeekClass =
    "h-8 leading-8 text-center text-sm border-b border-textLight";
  return (
    <div className="grid grid-cols-7 divide-x divide-x-textLight">
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
