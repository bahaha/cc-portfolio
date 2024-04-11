import { forwardRef } from "react";

type WordProps = {
  children?: React.ReactNode;
};

function Word({ children }: WordProps) {
  return (
    <div data-role="word" className="m-1 text-foreground/70">
      {children}
    </div>
  );
}

type LetterProps = {
  expect: string;
};

const Letter = forwardRef<HTMLSpanElement, LetterProps>(
  ({ expect }, forwardedRef) => {
    return (
      <span ref={forwardedRef} data-role="letter">
        {expect}
      </span>
    );
  },
);

export default Word;
Word.Letter = Letter;
