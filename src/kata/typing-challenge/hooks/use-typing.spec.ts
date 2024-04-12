import { describe, expect, test } from "vitest";
import { parseTypedText } from "./use-typing";

describe.concurrent(
  "[use-typing] parse typed text into words and letters",
  () => {
    test("[] if no typed", () => {
      expect(parseTypedText("")).toEqual([]);
    });

    test("[] if only spaces", () => {
      expect(parseTypedText("  ")).toEqual([[]]);
    });

    test("ignore all leading spaces", () => {
      expect(parseTypedText("  a")).toEqual([["a"]]);
    });

    test("count as a word if space occurs even no keys after the space", () => {
      expect(parseTypedText("foo ")).toEqual(["foo".split(""), []]);
    });

    test("count as a word if space occurs", () => {
      expect(parseTypedText("foo b")).toEqual(["foo".split(""), ["b"]]);
    });

    test("ignore the leading spaces of a word", () => {
      expect(parseTypedText("foo  ")).toEqual(["foo".split(""), []]);
    });
  },
);
