import "../../styles-jobs.css";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
// MUI Pagination is a labelled, keyboard-accessible page selector.
import Pagination from "@mui/material/Pagination";
import JobCard from "../../components/jobs/JobCard";
import JobFilters from "../../components/jobs/JobFilters";
import OpportunityOrbit from "../../components/experience/OpportunityOrbit";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import { pageNumber } from "../../utils/jobFormat";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function PublicJobs() {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const load = useCallback(
    (signal) =>
      jobService.search(
        {
          ...Object.fromEntries(new URLSearchParams(query)),
          page: pageNumber(new URLSearchParams(query)),
          per_page: 9,
        },
        signal,
      ),
    [query],
  );
  const resource = useApiResource(load);
  const categories = useApiResource(jobService.categories);
  function paginate(_event, page) {
    const next = new URLSearchParams(params);
    next.set("page", page);
    setParams(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  return (
    <div className="jobs-public">
      <section className="jobs-hero">
        <div className="page-container jobs-hero-inner">
          <div>
            <span className="eyebrow">A WORLD OF WHAT'S NEXT</span>
            <h1>
              A good move.
              <br />
              <em>A great future.</em>
            </h1>
            <p>
              Find the work that moves you. Explore real opportunities, meet new
              possibilities and take your next step.
            </p>
          </div>
          <OpportunityOrbit />
        </div>
      </section>
      <div className="page-container jobs-content">
        <JobFilters
          key={query}
          params={params}
          categories={categories.data || []}
          categoriesError={categories.error}
          retryCategories={categories.reload}
          onApply={(values) => setParams({ ...values, page: "1" })}
          onClear={() => setParams({})}
        />
        <div className="jobs-results-heading">
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>Open opportunities.</h2>
          </div>
          {!resource.loading && !resource.error && (
            <p role="status">
              {resource.data?.pagination?.total || 0} matching{" "}
              {(resource.data?.pagination?.total || 0) === 1 ? "role" : "roles"}
            </p>
          )}
        </div>
        {resource.loading ? (
          <Loading label="Finding your next move…" />
        ) : resource.error ? (
          <ErrorState message={resource.error} onRetry={resource.reload} />
        ) : !resource.data?.jobs.length ? (
          <section className="jobs-empty">
            <span>↗</span>
            <h2>
              A different search.
              <br />A new possibility.
            </h2>
            <p>
              No open roles match this page or these filters. Try a broader
              search.
            </p>
            <button className="text-action" onClick={() => setParams({})}>
              Show all open roles
            </button>
          </section>
        ) : (
          <>
            <div className="jobs-grid">
              {resource.data.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            {resource.data.pagination?.total_pages > 1 && (
              <Pagination
                className="jobs-pagination"
                aria-label="Job results pages"
                color="primary"
                page={pageNumber(params)}
                count={resource.data.pagination.total_pages}
                onChange={paginate}
                siblingCount={0}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
