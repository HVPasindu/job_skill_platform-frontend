import { useRef } from "react";
// Motion library: useScroll exposes a progress value; pages do not handle scroll math.
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import HeroVisual from "./HeroVisual";
export default function ImmersiveHero({ children }) {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  return (
    <section ref={heroRef} className="immersive-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="page-container hero-layout">
        <motion.div
          className="hero-copy"
          style={reduced ? undefined : { y: copyY }}
        >
          {children}
        </motion.div>
        <motion.div
          className="hero-art-column"
          style={reduced ? undefined : { y: visualY }}
        >
          <HeroVisual progress={scrollYProgress} />
        </motion.div>
      </div>
      <div className="page-container hero-bottom">
        <span>OPPORTUNITY, IN EVERY DIRECTION.</span>
        <a href="#discover" className="scroll-prompt">
          Scroll to discover <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
