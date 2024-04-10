import { faker } from "@faker-js/faker";
import Telepromoter from "./telepromoter";
import Word from "./word";
import { useWords } from "../hooks/use-words";

type GameBoardProps = {};

export default function GameBoard({}: GameBoardProps) {
  const { words } = useWords({ length: 50 });
  return (
    <div className="container flex h-screen max-w-5xl items-center justify-center bg-background">
      <Telepromoter>
        {words.map((word, i) => (
          <Word key={i}>
            {word.split("").map((letter, n) => (
              <Word.Letter key={`${i}_${n}`} expect={letter} />
            ))}
          </Word>
        ))}
      </Telepromoter>
    </div>
  );
}
