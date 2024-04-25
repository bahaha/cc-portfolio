import { cn } from "@/utils/ui-helpers";
import { cva } from "class-variance-authority";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type WordProps = {
  active?: boolean;
  children?: ReactNode;
  onRowFocus?: (shiftOffset: number, row: number) => void;
};

function InternalWord({
  children,
  active = false,
  onRowFocus: onLineFocus,
}: WordProps) {
  const [offsetTop, setOffsetTop] = useState<number | undefined>();
  const [offsetHeight, setOffsetHeight] = useState<number | undefined>();
  const row = offsetTop && offsetHeight ? ~~(offsetTop / offsetHeight) : -1;

  const measureWord = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setOffsetTop(node.offsetTop);
      setOffsetHeight(node.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const offset = row - 1;
    if (active && offset > 0) {
      onLineFocus?.(offsetHeight! * offset, row);
    }
  }, [active, row, onLineFocus]);

  return (
    <div ref={measureWord} data-role="word" data-state={active} className="m-1">
      {children}
    </div>
  );
}

type LetterProps = {
  className?: string;
  status?: "default" | "correct" | "incorrect" | "extra";
  children?: ReactNode;
};

const letterVariants = cva("", {
  variants: {
    status: {
      default: "text-foreground/60",
      correct: "text-foreground",
      incorrect: "text-destructive",
      extra: "text-destructive/50",
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
