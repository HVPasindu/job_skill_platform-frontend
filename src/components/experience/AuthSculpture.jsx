// Decorative CSS 3D sculpture. No canvas, textures, model download or React animation loop.
// All animation rules live beside this component in experience.css.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function AuthSculpture({ compact = false }) {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      ref={ref}
      className={`auth-sculpture ${compact ? "compact" : ""}`}
      data-active={active}
      aria-hidden="true"
    >
      <div className="sculpture-ground" />
      <div className="sculpture-orbit">
        <i className="sculpture-ring ring-a" />
        <i className="sculpture-ring ring-b" />
        <i className="sculpture-ring ring-c" />
        <span className="sculpture-core">↗</span>
        <i className="sculpture-moon" />
      </div>
      <span className="sculpture-caption">LEARN. CONNECT. MOVE.</span>
    </div>
  );
}
