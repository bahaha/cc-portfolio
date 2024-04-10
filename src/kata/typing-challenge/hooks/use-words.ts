import { faker } from "@faker-js/faker";
import { useState } from "react";

type UseWordsOptions = {
  length: number;
};

function generateWords({ length }: UseWordsOptions): string[] {
  return faker.lorem.words(length).split(" ");
}

export function useWords(options: UseWordsOptions) {
  const [words, setWords] = useState<string[]>(generateWords(options));

  return {
    words,
  };
}
