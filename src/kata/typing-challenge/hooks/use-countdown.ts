import { useCallback, useEffect, useRef, useState } from "react";

type UseCountDownOptions = {
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
          pause();
          onEnd?.();
        }
        return time - 1;
      });
    }, 1000);
  }, [hasEnded, running, setRemaining]);

  const pause = useCallback(() => {
    if (hasEnded || !running) return;
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, [hasEnded, running]);

  const reset = useCallback(
    (nextSeconds?: number) => {
      setRemaining(nextSeconds ?? seconds);
    },
    [seconds, setRemaining],
  );

  useEffect(() => {
    if (!autoPauseOnBlur) return;

    function handleFocusLeave() {
      pause();
      onPause?.();
    }

    function handleFocus() {
      onResume?.();
    }

    if (running) {
      window.addEventListener("blur", handleFocusLeave);
    } else {
      window.addEventListener("focus", handleFocus);
    }
    return () => {
      window.removeEventListener("blur", handleFocusLeave);
      window.removeEventListener("focus", handleFocus);
    };
  }, [running, autoPauseOnBlur, onPause, onResume]);

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
