import { useCallback, useEffect, useState } from "react";

type UseTypingOptions = {
  enable?: boolean;
};

function isSupportedKeyStroke(code: string) {
  const functionKeys = ["Backspace", "Space"];
  return functionKeys.includes(code) || code.startsWith("Key");
}

export function parseTypedText(typed: string): string[][] {
  if (!typed) return [];

  let words: string[][] = [];
  let letters: string[] = [];

  const text = typed.trimStart();
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      words.push(letters);
      letters = [];
      while (text[i + 1] === " ") i++;
    } else {
      letters.push(text[i]);
    }
  }

  words.push(letters);
  return words;
}

export function useTyping({ enable }: UseTypingOptions) {
  const [typed, setTyped] = useState<string>("");
  const typedWords = parseTypedText(typed);
  const range = {
    word: typedWords.length ? typedWords.length - 1 : 0,
    letter: typedWords[typedWords.length - 1]?.length || 0,
  };

  const keydownHandler = useCallback(
    ({ key, code }: KeyboardEvent) => {
      if (!enable || !isSupportedKeyStroke(code)) return;

      if (code === "Backspace") {
        setTyped((prev) =>
          prev.slice(0, prev[prev.length - 1] === " " ? -2 : -1),
        );
      } else {
        setTyped((prev) =>
          prev[prev.length - 1] === " " ? (prev + key).trim() : prev + key,
        );
      }
    },
    [enable],
  );

  function clearTyped() {
    setTyped("");
  }

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  return { typed: typedWords, range, clearTyped };
}
