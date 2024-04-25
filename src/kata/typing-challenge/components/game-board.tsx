/// <reference types="vite-plugin-svgr/client" />
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { useElementsRef } from "../hooks/use-elements-ref";
import { useTyping } from "../hooks/use-typing";
import { useWords } from "../hooks/use-words";
import Rotate from "../rotate-ccw.svg?react";
import Caret from "./caret";
import RestartButton from "./restart-button";
import Telepromoter from "./telepromoter";
import Word from "./word";

type GameBoardProps = {};

const MAX_EXTRA_LETTERS = 6;
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type ChallengeStatus = "pending" | "typing" | "completed";

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
    enable: status !== "completed",
  });
  const [wordRowShiftOffset, setWordRowShiftOffset] = useState(0);

  function handleRestartChallenge() {
    setStatus("pending");
    clearTyped();
    regenerateWords();
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
  }, [range.word, range.letter]);

  useEffect(() => {
    if (status === "pending" && typed.length > 0) {
      setStatus("typing");
    }
  }, [status, typed]);

  return (
    <div className="container flex h-screen max-w-5xl flex-col items-center justify-center gap-4 bg-background">
      <Telepromoter>
        <Caret rowOffset={-wordRowShiftOffset} lastLetterEl={lastEl} />
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
      <RestartButton onClick={handleRestartChallenge}>
        <Rotate />
      </RestartButton>
    </div>
  );
}
