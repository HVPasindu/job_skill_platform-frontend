import { useState } from "react";
// Save only a layout preference, never record data or personal information.
export default function useCollectionView(viewKey, defaultView = "grid") {
  const key = `skilljob.collection.${viewKey}`;
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "grid" || saved === "list") return saved;
    } catch {
      /* Browser storage can be unavailable; the switch still works. */
    }
    return defaultView;
  });
  function changeView(_event, next) {
    if (next !== "grid" && next !== "list") return;
    setView(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      /* Keep the in-memory choice. */
    }
  }
  return { view, changeView };
}
