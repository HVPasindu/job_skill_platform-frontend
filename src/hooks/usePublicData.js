// React built-in hooks manage loading/data/error state; AbortController cancels old requests.
import { useEffect, useState } from "react";
import { getApiError } from "../utils/apiError";

// Pass a service function declared outside the component so it stays stable.
export default function usePublicData(loadData) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await loadData(controller.signal);
        if (!controller.signal.aborted) setData(result);
      } catch (requestError) {
        if (!controller.signal.aborted) setError(getApiError(requestError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [loadData, requestNumber]);

  function retry() {
    setRequestNumber((previous) => previous + 1);
  }
  return { data, loading, error, retry };
}
