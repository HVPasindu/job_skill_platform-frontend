import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
// Built-in MUI responsive hook; it avoids mounting WebGL on small screens.
import { useMediaQuery } from "@mui/material";
// Motion library values keep mouse updates outside normal React state.
import { useMotionValue, useReducedMotion } from "motion/react";
import SceneBoundary from "./SceneBoundary";
import OrbitFallback from "./OrbitFallback";
import useSceneActivity from "./useSceneActivity";
const HeroScene = lazy(() => import("./HeroScene"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
export default function HeroVisual({ progress }) {
  const wrapper = useRef(null);
  const active = useSceneActivity(wrapper);
  const desktop = useMediaQuery("(min-width: 900px)");
  const reduced = useReducedMotion();
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const showScene =
    eligible &&
    desktop &&
    !reduced &&
    import.meta.env.VITE_ENABLE_3D !== "false";

  // Load optional WebGL after first paint and only near the viewport.
  useEffect(() => {
    if (
      !desktop ||
      reduced ||
      !active ||
      import.meta.env.VITE_ENABLE_3D === "false"
    )
      return;
    const timer = window.setTimeout(() => setEligible(supportsWebGL()), 800);
    return () => window.clearTimeout(timer);
  }, [desktop, reduced, active]);

  // Stable callback passed into the Canvas; it runs once after the scene starts.
  const onReady = useCallback(() => setReady(true), []);
  function move(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - box.left) / box.width - 0.5) * 2);
    pointerY.set(((event.clientY - box.top) / box.height - 0.5) * 2);
  }
  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }
  return (
    <div
      ref={wrapper}
      className="hero-visual"
      data-scene-active={active ? "true" : "false"}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <div className="portal-glow" />
      <div className="portal-grid" />
      <div
        className={`fallback-layer ${ready && showScene ? "scene-ready" : ""}`}
      >
        <OrbitFallback quiet={reduced} />
      </div>
      {showScene && (
        <div className={`hero-canvas ${ready ? "is-ready" : ""}`}>
          <SceneBoundary fallback={<OrbitFallback quiet={reduced} />}>
            <Suspense fallback={null}>
              <HeroScene
                active={active}
                onReady={onReady}
                progress={progress}
                pointerX={pointerX}
                pointerY={pointerY}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
      <div className="orbit-caption top-caption">
        <span className="caption-dot" />A NEW DIRECTION
      </div>
      <div className="orbit-caption bottom-caption">
        YOUR POTENTIAL, CONNECTED <span>↗</span>
      </div>
      <div className="orbital-tag tag-one">
        <span>↗</span> Find your next role
      </div>
      <div className="orbital-tag tag-two">
        <span>✳</span> Build what’s next
      </div>
      <span className="orbit-coordinate coordinate-one">01 — EXPLORE</span>
      <span className="orbit-coordinate coordinate-two">02 — EVOLVE</span>
    </div>
  );
}
