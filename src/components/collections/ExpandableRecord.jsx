import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./record-preview.css";

const Disclosure = createContext(null);

// Mark the record's variable-length fields with data-preview-text and place one
// RecordToggle beside its content, outside any links or existing action buttons.
export default function ExpandableRecord({
  as: Element = "article",
  className = "",
  children,
}) {
  const recordRef = useRef(null);
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  // Keep the first paint compact while the browser measures the actual lines.
  const [hasOverflow, setHasOverflow] = useState(null);

  useEffect(() => {
    const record = recordRef.current;
    const fields = Array.from(record.querySelectorAll("[data-preview-text]"));

    function measure() {
      // Check the collapsed layout even if the user resized an open record.
      if (!record.hasAttribute("data-collapsed"))
        record.setAttribute("data-measuring", "");
      const clipped = fields.some(
        (field) =>
          field.clientHeight > 0 && field.scrollHeight > field.clientHeight + 1,
      );
      record.removeAttribute("data-measuring");
      setHasOverflow(clipped);
      if (!clipped) setExpanded(false);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(record);
    fields.forEach((field) => observer.observe(field));
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [children]);

  return (
    <Disclosure.Provider
      value={hasOverflow ? { id, expanded, setExpanded } : null}
    >
      <Element
        id={id}
        ref={recordRef}
        className={`record-preview ${className}`.trimEnd()}
        data-collapsed={!expanded && hasOverflow !== false ? "" : undefined}
      >
        {children}
      </Element>
    </Disclosure.Provider>
  );
}

export function RecordToggle() {
  const disclosure = useContext(Disclosure);
  if (!disclosure) return null;
  const { id, expanded, setExpanded } = disclosure;
  return (
    <button
      type="button"
      className="record-toggle"
      aria-controls={id}
      aria-expanded={expanded}
      onClick={() => setExpanded((open) => !open)}
    >
      {expanded ? "Show less" : "View more"}
    </button>
  );
}
