/// <reference types="vite-plugin-svgr/client" />
import { motion } from "framer-motion";
import { useEffect } from "react";

import { useElementsRef } from "../hooks/use-elements-ref";
import { useWords } from "../hooks/use-words";
import Rotate from "../rotate-ccw.svg?react";
import Caret from "./caret";
import RestartButton from "./restart-button";
import Telepromoter from "./telepromoter";
import Word from "./word";

type GameBoardProps = {};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function GameBoard({}: GameBoardProps) {
  const { words, regenerateWords } = useWords({ length: 50 });
  const { lastEl, attachElementRef, pickElement } = useElementsRef();

  useEffect(() => {
    pickElement([0, 2]);
  }, [words]);

  return (
    <div className="container flex h-screen max-w-5xl flex-col items-center justify-center gap-4 bg-background">
      <Telepromoter>
        <Caret lastLetterEl={lastEl} />
        <motion.div
          key={words}
          className="flex flex-wrap"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{ duration: 1.5, type: "spring" }}
        >
          {words.split(" ").map((word, w) => (
            <Word key={w}>
              {word.split("").map((letter, i) => (
                <Word.Letter
                  ref={attachElementRef([w, i])}
                  key={`${w}_${i}`}
                  expect={letter}
                />
              ))}
            </Word>
          ))}
        </motion.div>
      </Telepromoter>
      <RestartButton onClick={regenerateWords}>
        <Rotate />
      </RestartButton>
    </div>
  );
}
