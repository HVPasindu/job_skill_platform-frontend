// Motion built-ins provide spring-smoothed rotation; all pointer math stays in this file.
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

export default function TiltCard({ children, className = "" }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 22 });
  function handleMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - box.top) / box.height - 0.5) * 8);
    y.set(((event.clientX - box.left) / box.width - 0.5) * 8);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <div className="tilt-perspective">
      <motion.div
        className={className}
        style={{ rotateX, rotateY }}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
      >
        {children}
      </motion.div>
    </div>
  );
}
