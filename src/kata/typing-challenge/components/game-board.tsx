/// <reference types="vite-plugin-svgr/client" />
import { motion } from "framer-motion";

import { useWords } from "../hooks/use-words";
import Rotate from "../rotate-ccw.svg?react";
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
  return (
    <div className="container flex h-screen max-w-5xl flex-col items-center justify-center gap-4 bg-background">
      <motion.div
        key={words[0]}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
        transition={{ duration: 1.5, type: "spring" }}
      >
        <Telepromoter>
          {words.map((word, i) => (
            <Word key={i}>
              {word.split("").map((letter, n) => (
                <Word.Letter key={`${i}_${n}`} expect={letter} />
              ))}
            </Word>
          ))}
        </Telepromoter>
      </motion.div>
      <RestartButton onClick={regenerateWords}>
        <Rotate />
      </RestartButton>
    </div>
  );
}
