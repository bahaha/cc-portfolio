import { faker } from "@faker-js/faker";
import { useState } from "react";

type UseWordsOptions = {
  length: number;
};

function generateWords({ length }: UseWordsOptions): string[][] {
  return faker.lorem
    .words(length)
    .split(" ")
    .map((word) => word.split(""));
}

export function useWords(options: UseWordsOptions) {
  const [version, setVersion] = useState(0);
  const [words, setWords] = useState<string[][]>(generateWords(options));

  const regenerateWords = () => {
    setWords(generateWords(options));
    setVersion((v) => v + 1);
  };

  return {
    words,
    version,
    regenerateWords,
  };
}
