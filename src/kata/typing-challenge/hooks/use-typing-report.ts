type UseTypingHeroOptions = {
  enable?: boolean;
  duration: number;
  remaining: number;
  words: string[][];
  typed: string[][];
};

type Accuracy = {
  correct: number;
  incorrect: number;
  extra: number;
};

function countLetters(word: string[], typed: string[] | undefined): Accuracy {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;

  if (!typed) {
    return { correct, incorrect, extra };
  }

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    if (letter === typed[i]) {
      correct++;
    } else {
      incorrect++;
    }
  }

  if (typed.length > word.length) {
    extra = typed.length - word.length;
  }
  return { correct, incorrect, extra };
}

function sumAccuracy(acc: Accuracy, curr: Accuracy): Accuracy {
  return {
    correct: acc.correct + curr.correct,
    incorrect: acc.incorrect + curr.incorrect,
    extra: acc.extra + curr.extra,
  };
}

function round(value: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function useTypingHero({
  enable = false,
  duration,
  remaining,
  words,
  typed,
}: UseTypingHeroOptions) {
  if (!enable) return;

  const elapsed = duration - remaining;
  const accuracy = words
    .map((word, index) => countLetters(word, typed[index]))
    .reduce(sumAccuracy, { correct: 0, incorrect: 0, extra: 0 });

  const tpm = Math.round((accuracy.correct / elapsed) * 60);

  const totalTypedLetters =
    accuracy.correct + accuracy.incorrect + accuracy.extra;

  const accuracyRate =
    totalTypedLetters === 0
      ? 0
      : round(accuracy.correct / totalTypedLetters + Number.EPSILON, 2);

  return {
    tpm,
    accuracyRate,
  };
}
