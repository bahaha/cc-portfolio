import type { ReactNode } from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

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

export default ChallengeArea;
