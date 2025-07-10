import clsx from "clsx";

interface IToolbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
}

const ToolbarButton = ({
  onClick,
  children,
  active,
  ariaLabel,
}: IToolbarButtonProps) => (
  <button
    type="button"
    className={clsx("w-6 h-6", active && "bg-white bg-opacity-20 rounded")}
    onClick={onClick}
    aria-pressed={active}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export default ToolbarButton;
