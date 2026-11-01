import { useEffect, useState } from "react";

// Browser APIs: pause GPU rendering when this scene is offscreen or the tab is hidden.
export default function useSceneActivity(elementRef) {
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const Observer = window.IntersectionObserver;
    const observer = Observer
      ? new Observer(([entry]) => setVisible(entry.isIntersecting), {
          rootMargin: "80px",
        })
      : null;
    observer?.observe(element);
    if (!observer) queueMicrotask(() => setVisible(true));
    function onVisibilityChange() {
      setTabVisible(!document.hidden);
    }
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [elementRef]);
  return visible && tabVisible;
}
