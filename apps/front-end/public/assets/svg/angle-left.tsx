import { ISvgIcon } from "@/lib/types/svgIcon";

const AngleLeftIcon = ({ className }: ISvgIcon) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m15 19-7-7 7-7"
    />
  </svg>
);

export default AngleLeftIcon;
