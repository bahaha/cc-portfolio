import { cn } from "@/utils/ui-helpers";
import { motion } from "framer-motion";

type TypingHeroProps = {
  className?: string;
  tpm: number;
  accuracy: number;
};

export function TypingHero({ className, tpm, accuracy }: TypingHeroProps) {
  return (
    <motion.div
      className={cn(
        "w-96 rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      initial={{ opacity: 0, scale: 0.9, y: "100%" }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          You're a <span className="font-bold text-primary">Typing Hero !</span>
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="flex justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold">Typing Speed</span>
            <span className="text-4xl font-semibold">{tpm} tpm</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-semibold">Accuracy</span>
            <span className="text-4xl font-semibold">{accuracy * 100}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TypingHero;
