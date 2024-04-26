import { describe, test } from "vitest";
import { useTypingHero } from "./use-typing-report";

describe.concurrent("[typing hero] calculate typing metrics", () => {
  const baseOptions = {
    enable: true,
    duration: 60,
    remaining: 0,
    words: ["foo".split(""), "bar".split(""), "baz".split("")],
    typed: ["f".split(""), "b".split(""), "ba".split("")],
  } satisfies Parameters<typeof useTypingHero>[0];

  test("if no enable, do not calculate", ({ expect }) => {
    expect(useTypingHero({ ...baseOptions, enable: false })).toBeUndefined();
  });

  test("calculate typing metrics with 2-digits precision ", ({ expect }) => {
    expect(
      useTypingHero({ ...baseOptions, duration: 60, remaining: 55 }),
    ).toEqual({
      // f__, b__, ba_; 4 letters in 5 seconds, tpm will be 48
      tpm: 48,
      // correct: f, b, ba, incorrect: oo, ar, z, extra: 0
      accuracyRate: 0.44,
    });
  });

  test("calculate typing metrics with no input", ({ expect }) => {
    expect(useTypingHero({ ...baseOptions, remaining: 0, typed: [] })).toEqual({
      tpm: 0,
      accuracyRate: 0,
    });
  });

  test("extra letters are not counted as tpm", ({ expect }) => {
    expect(
      useTypingHero({
        ...baseOptions,
        typed: [
          "foooooooo".split(""),
          "barrrrr".split(""),
          "bazzzzz".split(""),
        ],
      }),
    ).toEqual({
      // foo, bar, baz; 9 letters in 60 seconds
      tpm: 9,
      // 9 / (9 + 7 + 7) = 0.39
      accuracyRate: 0.39,
    });
  });
});
