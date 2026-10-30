import { useEffect, useState } from "react";

// Browser APIs: pause GPU rendering when this scene is offscreen or the tab is hidden.
export default function useSceneActivity(elementRef) {
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(element);
    function onVisibilityChange() {
      setTabVisible(!document.hidden);
    }
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [elementRef]);
  return visible && tabVisible;
}
