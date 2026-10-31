// Procedural CSS 3D rings. All animation stays in experience/; no extra assets or libraries.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function GrowthOrbit() {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      className="growth-orbit"
      ref={ref}
      data-active={active}
      aria-hidden="true"
    >
      <div className="growth-assembly">
        <i className="growth-ring ring-one" />
        <i className="growth-ring ring-two" />
        <div className="growth-core">↗</div>
        <span>KEEP YOUR CURIOSITY MOVING</span>
      </div>
    </div>
  );
}
