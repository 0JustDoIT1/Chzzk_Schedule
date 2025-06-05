import { ISvgIcon } from "@/types/svgIcon";

const ChevronUpIcon = ({ className, onClick }: ISvgIcon) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    onClick={onClick}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m16 14-4-4-4 4"
    />
  </svg>
);

export default ChevronUpIcon;
