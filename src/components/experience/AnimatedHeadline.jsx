import { useEffect, useState } from "react";
// Motion library: AnimatePresence animates the old word out and the new word in.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
const words = ["future.", "career.", "ideas."];
export default function AnimatedHeadline() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % words.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return (
    <h1 className="hero-title" aria-label="Put your future in motion.">
      <span aria-hidden="true">Put your</span>
      <span className="changing-word" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={reduced ? false : { y: "100%", rotateX: -65, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            exit={{ y: "-90%", rotateX: 65, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[reduced ? 0 : index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden="true">in motion.</span>
    </h1>
  );
}
