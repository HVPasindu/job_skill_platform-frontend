// Lightweight CSS 3D visual. Complex transforms/keyframes are isolated in experience.css.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function SeekerSculpture() {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      className="seeker-sculpture"
      ref={ref}
      data-active={active}
      aria-hidden="true"
    >
      <div className="seeker-card-orbit">
        <i className="seeker-glass-card card-back" />
        <i className="seeker-glass-card card-middle" />
        <div className="seeker-glass-card card-front">
          <span>YOUR NEXT CHAPTER</span>
          <strong>↗</strong>
          <i />
          <i />
          <i />
        </div>
        <span className="seeker-orbit-dot" />
      </div>
    </div>
  );
}
