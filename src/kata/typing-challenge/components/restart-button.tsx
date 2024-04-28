import { cn } from "@/utils/ui-helpers";
import { useRef, type ReactNode } from "react";

type RestartButtonProps = {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

export default function RestartButton({
  className,
  children,
  onClick,
  ...props
}: RestartButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (ref.current) {
      ref.current.blur();
    }

    onClick?.();
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "text-secondary-foreground hover:bg-secondary/80",
        "h-11 rounded-md px-8",
        className,
      )}
      tabIndex={-1}
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
