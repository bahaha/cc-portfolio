import { useCallback, useState } from "react";

type CaretProps = {
  lastLetterEl?: HTMLSpanElement;
};

type Coordinate = { x: number; y: number };

const TRACKING_OFFSET = 2;
function getCaretPosition(
  caretHeight: number,
  el: HTMLSpanElement | undefined,
): Coordinate {
  if (!el) {
    return { x: 0, y: 0 };
  }

  return {
    x: el.offsetLeft + el.offsetWidth - TRACKING_OFFSET,
    y: el.offsetTop + el.offsetHeight / 2 - caretHeight / 2,
  };
}

export default function Caret({ lastLetterEl }: CaretProps) {
  const [caretHeight, setCaretHeight] = useState(0);
  const { x, y } = getCaretPosition(caretHeight, lastLetterEl);

  const measureCaret = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setCaretHeight(node.offsetHeight);
    }
  }, []);

  return (
    <div
      ref={measureCaret}
      className="animate-caret-flash absolute h-7 w-0.5 bg-primary"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
}
