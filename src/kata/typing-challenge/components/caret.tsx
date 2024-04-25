import { useCallback, useState } from "react";

type CaretProps = {
  rowOffset?: number;
  lastLetterEl?: HTMLSpanElement;
};

type Coordinate = { x: number; y: number };

const TRACKING_OFFSET = 2;
function getCaretPosition(
  caretHeight: number,
  el: HTMLSpanElement | undefined,
  rowOffset: number = 0,
): Coordinate {
  if (!el) {
    return { x: 0, y: 0 };
  }

  return {
    x: el.offsetLeft + el.offsetWidth - TRACKING_OFFSET,
    y: el.offsetTop + el.offsetHeight / 2 + rowOffset - caretHeight / 2,
  };
}

export default function Caret({ lastLetterEl, rowOffset }: CaretProps) {
  const [caretHeight, setCaretHeight] = useState(0);
  const { x, y } = getCaretPosition(caretHeight, lastLetterEl, rowOffset);

  const measureCaret = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setCaretHeight(node.offsetHeight);
    }
  }, []);

  return (
    <div
      ref={measureCaret}
      className="absolute h-7 w-0.5 animate-caret-flash bg-primary"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
}
