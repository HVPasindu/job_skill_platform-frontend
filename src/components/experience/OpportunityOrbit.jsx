// CSS-only 3D cards. No extra WebGL/model download; all keyframes stay in experience.css.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function OpportunityOrbit() {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      className="opportunity-orbit"
      ref={ref}
      data-active={active}
      aria-hidden="true"
    >
      <div className="opportunity-stack">
        <span className="opportunity-tile tile-peach">
          MAKE
          <br />
          YOUR MOVE.
        </span>
        <span className="opportunity-tile tile-blue">
          NEXT
          <br />
          CHAPTER ↗
        </span>
        <span className="opportunity-tile tile-lime">
          <i>✦</i>OPPORTUNITY
          <br />
          STARTS HERE.
        </span>
      </div>
      <span className="opportunity-track" />
    </div>
  );
}
