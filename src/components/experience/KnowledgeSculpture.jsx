// Lightweight procedural CSS 3D book. No models, textures, canvas or network downloads.
import { useRef } from "react";
import useSceneActivity from "./useSceneActivity";
export default function KnowledgeSculpture() {
  const ref = useRef(null);
  const active = useSceneActivity(ref);
  return (
    <div
      className="knowledge-sculpture"
      ref={ref}
      data-active={active}
      aria-hidden="true"
    >
      <div className="knowledge-orbit">
        <div className="knowledge-book">
          <i className="book-back" />
          <i className="book-page page-one" />
          <i className="book-page page-two" />
          <i className="book-page page-three" />
          <div className="book-cover">
            <span>↗</span>
            <b>
              KNOW
              <br />
              MORE.
            </b>
            <small>GO FURTHER.</small>
          </div>
        </div>
        <i className="knowledge-dot dot-one" />
        <i className="knowledge-dot dot-two" />
        <span className="knowledge-stamp">IDEAS INTO POSSIBILITIES</span>
      </div>
    </div>
  );
}
