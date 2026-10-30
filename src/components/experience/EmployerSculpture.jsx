// Procedural CSS 3D - no model, texture, font or canvas downloads.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function EmployerSculpture() {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      className="employer-sculpture"
      ref={ref}
      data-active={active}
      aria-hidden="true"
    >
      <div className="employer-tower">
        <i className="tower-block tower-one" />
        <i className="tower-block tower-two" />
        <i className="tower-block tower-three" />
        <span>↗</span>
        <b>BUILD WHAT'S NEXT</b>
      </div>
    </div>
  );
}
