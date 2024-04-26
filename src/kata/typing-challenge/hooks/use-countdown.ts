import { useCallback, useEffect, useRef, useState } from "react";

type UseAutoTypeBreakingOptions = {
  enable?: boolean;
  running?: boolean;
  onPause?: () => void;
  onResume?: () => void;
};

function useAutoTypeBreaking({
  enable = true,
  running = true,
  onPause,
  onResume,
}: UseAutoTypeBreakingOptions) {
  useEffect(() => {
    function clearup() {
      onPause && window.removeEventListener("blur", onPause);
      onResume && window.removeEventListener("focus", onResume);
    }

    if (!enable) {
      onPause?.();
      clearup();
      return;
    }

    if (running) {
      onPause && window.addEventListener("blur", onPause);
      onResume && window.removeEventListener("focus", onResume);
    } else {
      onResume && window.addEventListener("focus", onResume);
      onPause && window.removeEventListener("blur", onPause);
    }

    return () => {
      clearup();
    };
  }, [enable, onPause, onResume]);
}

type UseCountDownOptions = {
  enable?: boolean;
  seconds: number;
  autoPauseOnBlur?: boolean;
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
