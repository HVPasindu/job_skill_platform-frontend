// Motion library: spring values move this wrapper without rerendering the page.
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
export default function Magnetic({ children, className = "" }) {
  const reduced = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 300, damping: 24 });
  const y = useSpring(targetY, { stiffness: 300, damping: 24 });
  function move(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    targetY.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  }
  function reset() {
    targetX.set(0);
    targetY.set(0);
  }
  return (
    <motion.span
      className={`magnetic ${className}`}
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.span>
  );
}
