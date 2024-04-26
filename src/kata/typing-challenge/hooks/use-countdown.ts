import { useCallback, useEffect, useRef, useState } from "react";

type UseAutoTypeBreakingOptions = {
  targetEl: HTMLElement | typeof globalThis;
  enable?: boolean;
  running?: boolean;
  onPause?: () => void;
  onResume?: () => void;
};

function useAutoTypeBreaking({
  enable = true,
  running = true,
  targetEl,
  onPause,
  onResume,
}: UseAutoTypeBreakingOptions) {
  useEffect(() => {
    if (!targetEl || !onPause || !onResume) return;
    function clearup() {
      onPause && targetEl.removeEventListener("blur", onPause);
      onResume && targetEl.removeEventListener("focus", onResume);
    }

    if (!enable) {
      onPause?.();
      clearup();
      return;
    }

    onPause && targetEl.addEventListener("blur", onPause);
    onResume && targetEl.addEventListener("focus", onResume);

    return () => {
      clearup();
    };
  }, [enable, running, targetEl, onPause, onResume]);
}

type UseCountDownOptions = {
  enable?: boolean;
  seconds: number;
  autoPauseOnBlur?: boolean;
  targetEl?: HTMLElement | typeof globalThis;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
};

// if the user leaves the focus to the window, then the countdown should pause
// so it's nice to use a intuitive setInterval approach,
// or maybe a worker will be better to handle accurate time processing
export function useCountDown({
  enable = true,
  seconds,
  autoPauseOnBlur = true,
  targetEl = window,
  onPause,
  onResume,
  onEnd,
}: UseCountDownOptions) {
  const [remaining, setRemaining] = useState<number>(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasEnded = remaining <= 0;
  const running = intervalRef.current !== null;
  const isPaused = !running && remaining < seconds && remaining > 0;

  const start = useCallback(() => {
    if (hasEnded || running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((time) => {
        if (time <= 1) {
          intervalRef.current && clearInterval(intervalRef.current);
          intervalRef.current = null;
          onEnd?.();
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  }, [hasEnded, running, setRemaining]);

  const pause = useCallback(() => {
    if (!running) return;
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, [running]);

  const reset = useCallback(
    (nextSeconds?: number) => {
      setRemaining(nextSeconds ?? seconds);
    },
    [seconds, setRemaining],
  );

  useAutoTypeBreaking({
    targetEl,
    enable: autoPauseOnBlur && enable && !hasEnded,
    running,
    onPause: () => {
      pause();
      enable && onPause?.();
    },
    onResume,
  });

  useEffect(() => {
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  return {
    hasEnded,
    isPaused,
    running,
    remaining,
    start,
    pause,
    reset,
  };
}
