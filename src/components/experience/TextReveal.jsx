import { useRef } from "react";
// Motion library: words change opacity with scroll progress, without page rerenders.
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
function RevealWord({ word, index, total, progress }) {
  const reduced = useReducedMotion();
  const opacity = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0.3, 1],
  );
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }}>
      {word}{" "}
    </motion.span>
  );
}
export default function TextReveal({ text }) {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 85%", "end 45%"],
  });
  const words = text.split(" ");
  return (
    <div ref={section} className="scroll-statement">
      <span className="eyebrow">YOUR NEXT CHAPTER IS CONNECTED</span>
      <h2>
        {words.map((word, index) => (
          <RevealWord
            key={`${word}-${index}`}
            word={word}
            index={index}
            total={words.length}
            progress={scrollYProgress}
          />
        ))}
      </h2>
      <div className="statement-orbit" aria-hidden="true" />
    </div>
  );
}
