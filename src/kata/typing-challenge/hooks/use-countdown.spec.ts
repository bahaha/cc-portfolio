import { afterEach, beforeEach, describe, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountDown } from "./use-countdown";

// @vitest-environment jsdom
describe.concurrent("[use-countdown] countdown timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("should start countdown and reduce time correctly", ({ expect }) => {
    const { result } = renderHook(() => useCountDown({ seconds: 10 }));
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.remaining).toBe(8);
  });

  test("should start, pause, reset manually correctly", ({ expect }) => {
    const { result } = renderHook(() => useCountDown({ seconds: 10 }));
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);
    act(() => {
      result.current.pause();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);
    act(() => {
      result.current.reset();
    });
    expect(result.current.remaining).toBe(10);

    act(() => {
      result.current.reset(60);
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(59);
  });

  test("should attach and detach event listeners correctly based on enable and running states", ({
    expect,
  }) => {
    const onPause = vi.fn().mockName("onPause");
    const onResume = vi.fn().mockName("onResume");
    const stubEl = document.createElement("div");

    const { result, rerender } = renderHook(() =>
      useCountDown({
        enable: true,
        seconds: 10,
        targetEl: stubEl,
        autoPauseOnBlur: true,
        onPause,
        onResume,
      }),
    );

    // start the timer, pass 1 second
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);

    // blur from the target element, auto pause to stop the timer
    act(() => {
      stubEl.dispatchEvent(new Event("blur"));
      vi.advanceTimersByTime(1000);
      rerender();
    });
    expect(result.current.remaining).toBe(9);
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(result.current.running).toBe(false);

    // focus back to the target element, resume the timer, but not start the timer immediately
    act(() => {
      stubEl.dispatchEvent(new Event("focus"));
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);
    expect(onResume).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(8);
  });

  test("if the challenge was completed before the countdown ends, the countdown should stop by changing the props `enable` from true to false", ({
    expect,
  }) => {
    const onPause = vi.fn().mockName("onPause");
    const onResume = vi.fn().mockName("onResume");
    const stubEl = document.createElement("div");
    const props = { enable: true, seconds: 10, onPause, onResume, stubEl };
    const { result, rerender } = renderHook((props) => useCountDown(props), {
      initialProps: props,
    });

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);

    rerender({ ...props, enable: false });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.remaining).toBe(9);

    // not listening to blur/focus events anymore
    act(() => {
      stubEl.dispatchEvent(new Event("blur"));
    });
    expect(onPause).not.toHaveBeenCalled();

    // focus back to the target element, resume the timer, but not start the timer immediately
    act(() => {
      stubEl.dispatchEvent(new Event("focus"));
      vi.advanceTimersByTime(1000);
    });
    expect(onResume).not.toHaveBeenCalled();
    expect(result.current.remaining).toBe(9);
  });
});
