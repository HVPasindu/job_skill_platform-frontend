import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useApiResource from "./useApiResource";
import { pageNumber } from "../utils/jobFormat";
// URL state survives refresh/back. The server supplies real totals, not client-side slices.
export default function usePagedResource(loader, size = 8) {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const load = useCallback(
    (signal) =>
      loader(
        {
          ...Object.fromEntries(new URLSearchParams(query)),
          page: pageNumber(new URLSearchParams(query)),
          per_page: size,
        },
        signal,
      ),
    [loader, query, size],
  );
  const resource = useApiResource(load);
  const pagination = resource.data?.pagination;
  useEffect(() => {
    if (resource.loading || resource.error || !pagination) return;
    const last = Math.max(1, pagination.total_pages);
    if (pagination.page > last) {
      const next = new URLSearchParams(query);
      next.set("page", String(last));
      setParams(next, { replace: true });
    }
  }, [resource.loading, resource.error, pagination, query, setParams]);
  function setPage(_event, page) {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function filter(values) {
    setParams({
      ...Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== ""),
      ),
      page: "1",
    });
  }
  return { ...resource, params, setPage, filter };
}
