import { ISvgIcon } from "@/types/svgIcon";

const MenuIcon = ({ className }: ISvgIcon) => (
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
      strokeWidth="2"
      d="M5 7h14M5 12h14M5 17h14"
    />
  </svg>
);

export default MenuIcon;
