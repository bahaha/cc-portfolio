import { cn } from "@/utils/ui-helpers";
import { forwardRef, memo, type ReactNode } from "react";
import { cva } from "class-variance-authority";

type WordProps = {
  active?: boolean;
  children?: ReactNode;
};

function InternalWord({ children, active = false }: WordProps) {
  return (
    <div data-role="word" data-state={active} className="m-1">
      {children}
    </div>
  );
}

type LetterProps = {
  className?: string;
  status?: "default" | "correct" | "incorrect";
  children?: ReactNode;
};

const letterVariants = cva("", {
  variants: {
    status: {
      default: "text-foreground/60",
      correct: "text-foreground",
      incorrect: "text-destructive",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

const Letter = forwardRef<HTMLSpanElement, LetterProps>(
  ({ className, status, children }, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        data-role="letter"
        className={cn(letterVariants({ status }), className)}
      >
        {children}
      </span>
    );
  },
);

type Word = typeof InternalWord & {
  Letter: typeof Letter;
};

const Word = memo(
  InternalWord,
  (prev, next) => !prev.active && prev.active === next.active,
) as unknown as Word;

Word.Letter = Letter;

export default Word;
