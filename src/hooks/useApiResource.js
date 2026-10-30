import { useCallback, useEffect, useState } from "react";
import { getApiError } from "../utils/apiError";
// loaders are stable callbacks supplied by pages. Abort on unmount and discard stale reads.
export default function useApiResource(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active)
          setState((previous) => ({ ...previous, loading: true, error: "" }));
        return loader(controller.signal);
      })
      .then((data) => {
        if (active) setState({ data, loading: false, error: "" });
      })
      .catch((error) => {
        if (active && error.code !== "ERR_CANCELED")
          setState((previous) => ({
            ...previous,
            loading: false,
            error: getApiError(error),
          }));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [loader, revision]);
  return { ...state, reload };
}
