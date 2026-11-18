// CSS-only 3D object: no Three.js canvas, image downloads or new animation library.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function AssistantOrb({ active = true, large = false }) {
  const ref = useRef(null);
  const visible = useSceneActivity(ref);
  return (
    <div
      ref={ref}
      className={`assistant-orb ${large ? "assistant-orb-large" : ""}`}
      data-active={active && visible}
      aria-hidden="true"
    >
      <div className="assistant-orb-assembly">
        <i />
        <i />
        <i />
        <b>✦</b>
      </div>
    </div>
  );
}
