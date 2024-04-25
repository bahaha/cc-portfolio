/// <reference types="vite-plugin-svgr/client" />
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { useCountDown } from "../hooks/use-countdown";
import { useElementsRef } from "../hooks/use-elements-ref";
import { useTyping } from "../hooks/use-typing";
import { useWords } from "../hooks/use-words";
import Rotate from "../rotate-ccw.svg?react";
import Caret from "./caret";
import { ChallengeConfig } from "./challenge-config";
import RestartButton from "./restart-button";
import Telepromoter from "./telepromoter";
import Timer from "./timer";
import Word from "./word";
import { useTypingHero } from "../hooks/use-typing-report";
import TypingHero from "./typing-hero";

type GameBoardProps = {};

const MAX_EXTRA_LETTERS = 6;
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type ChallengeStatus = "pending" | "typing" | "paused" | "completed";

type ChallengeAreaProps = {
  yOffset: number;
  children: ReactNode;
};
function ChallengeArea({ yOffset, children }: ChallengeAreaProps) {
  return (
    <motion.div
      className="flex flex-wrap transition-transform duration-300"
      style={{ transform: `translateY(${yOffset}px)` }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 1.5, type: "spring" }}
    >
      {children}
    </motion.div>
  );
}

export default function GameBoard({}: GameBoardProps) {
  const [status, setStatus] = useState<ChallengeStatus>("pending");
  const { words, version, regenerateWords } = useWords({ length: 50 });
  const { lastEl, attachElementRef, pickElement } = useElementsRef();
  const { typed, range, clearTyped } = useTyping({
    enable: status === "pending" || status === "typing",
  });
  const [wordRowShiftOffset, setWordRowShiftOffset] = useState(0);
  const [duration, setDuration] = useState(60);
  const {
    isPaused,
    remaining,
    start,
    reset: resetTimer,
  } = useCountDown({
    seconds: duration,
    onPause: () => setStatus("paused"),
    onResume: () => setStatus("pending"),
    onEnd: () => setStatus("completed"),
  });
  const typingHero = useTypingHero({
    enable: status === "completed",
    duration,
    remaining,
    words,
    typed,
  });

  function handleRestartChallenge() {
    setStatus("pending");
    clearTyped();
    regenerateWords();
    resetTimer();
  }

  function handleDurationChange(nextDuration: number) {
    setDuration(nextDuration);
    resetTimer(nextDuration);
  }

  function getTypedLetterStatus(
    expect: string,
    typed?: string,
  ): "default" | "correct" | "incorrect" {
    if (!typed) return "default";
    return typed === expect ? "correct" : "incorrect";
  }

  useEffect(() => {
    pickElement([range.word, range.letter]);
    const inLastWord = range.word === words.length - 1;
    const inLastLetter = range.letter === words[range.word]?.length;
    if (inLastWord && inLastLetter) {
      setStatus("completed");
    }
  }, [range.word, range.letter]);

  useEffect(() => {
    if (status === "pending" && typed.length > 0) {
      setStatus("typing");
      start();
    }
  }, [status, typed]);

  return (
    <div className="container flex h-screen max-w-5xl flex-col items-center justify-center gap-4 bg-background">
      {status === "pending" && typed.length === 0 && (
        <ChallengeConfig
          currentDuration={duration}
          onDurationChange={handleDurationChange}
        />
      )}
      {status === "typing" && <Timer seconds={remaining} />}
      <Telepromoter>
        {status !== "completed" && isPaused && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 supports-[backdrop-filter]:bg-background/60"
            data-role="overlay"
            data-state={isPaused ? "open" : "closed"}
          >
            Paused
          </div>
        )}
        {status !== "completed" && (
          <Caret rowOffset={-wordRowShiftOffset} lastLetterEl={lastEl} />
        )}
        <ChallengeArea key={version} yOffset={-wordRowShiftOffset}>
          {words.map((letters, w) => (
            <Word
              key={w}
              active={range?.word === w}
              onRowFocus={setWordRowShiftOffset}
            >
              {letters.map((letter, i) => (
                <Word.Letter
                  ref={attachElementRef([w, i])}
                  key={`${w}_${i}`}
                  status={getTypedLetterStatus(letter, typed?.[w]?.[i])}
                >
                  {letter}
                </Word.Letter>
              ))}
              {typed[w]
                ?.slice(letters.length, letters.length + MAX_EXTRA_LETTERS)
                .map((extra, i) => (
                  <Word.Letter
                    ref={attachElementRef([w, letters.length + i])}
                    key={`extra_${w}_${i}`}
                    status="extra"
                  >
                    {extra}
                  </Word.Letter>
                ))}
            </Word>
          ))}
        </ChallengeArea>
      </Telepromoter>
      {status === "completed" && typingHero && (
        <TypingHero
          className="absolute bottom-4"
          tpm={typingHero.tpm}
          accuracy={typingHero.accuracyRate}
        />
      )}
      <RestartButton onClick={handleRestartChallenge}>
        <Rotate />
      </RestartButton>
    </div>
  );
}
