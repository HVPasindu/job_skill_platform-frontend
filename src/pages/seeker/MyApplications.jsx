import "../../styles-jobs.css";
import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TextField, MenuItem, Pagination } from "@mui/material";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import {
  APPLICATION_STATUSES,
  dateLabel,
  pageNumber,
  words,
} from "../../utils/jobFormat";
import ApplicationStatus from "../../components/jobs/ApplicationStatus";
import SeekerHeader from "../../components/seeker/SeekerHeader";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function MyApplications() {
  const [params, setParams] = useSearchParams();
  const status = APPLICATION_STATUSES.includes(params.get("status"))
    ? params.get("status")
    : "";
  const page = pageNumber(params);
  const load = useCallback(
    (signal) =>
      jobService.applications(
        { status: status || undefined, page, per_page: 8 },
        signal,
      ),
    [status, page],
  );
  const resource = useApiResource(load);
  return (
    <>
      <SeekerHeader
        eyebrow="YOUR MOVES. YOUR MOMENTUM."
        title={
          <>
            Every application.
            <br />A possibility.
          </>
        }
        description="Keep track of the roles you've reached for and the next steps along the way."
      />
      <div className="seeker-toolbar">
        <TextField
          select
          size="small"
          label="Application status"
          value={status}
          onChange={(event) =>
            setParams(event.target.value ? { status: event.target.value } : {})
          }
        >
          <MenuItem value="">All applications</MenuItem>
          {APPLICATION_STATUSES.map((value) => (
            <MenuItem key={value} value={value}>
              {words(value)}
            </MenuItem>
          ))}
        </TextField>
        <Button to="/jobs">Find another opportunity ↗</Button>
      </div>
      {resource.loading ? (
        <Loading label="Checking your applications…" />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.applications.length ? (
        <section className="jobs-empty">
          <span>↗</span>
          <h2>Your next move is waiting.</h2>
          <p>
            No applications match this page or status. Browse open roles or
            choose another filter.
          </p>
          <Button to="/jobs">Explore opportunities ↗</Button>
        </section>
      ) : (
        <>
          <p className="applications-count" role="status">
            {resource.data.pagination.total} matching applications
          </p>
          <div className="applications-list">
            {resource.data.applications.map((application) => (
              <article className="application-list-card" key={application.id}>
                <div>
                  <span className="eyebrow">{application.company_name}</span>
                  <h2>
                    <Link
                      to={`/dashboard/job-seeker/applications/${application.id}`}
                    >
                      {application.job_title}
                    </Link>
                  </h2>
                  <p>
                    {application.location || "Location not specified"} · Applied{" "}
                    {dateLabel(application.applied_at)}
                  </p>
                  <span>
                    {application.resume_file_name || "No resume attached"}
                  </span>
                </div>
                <div>
                  <ApplicationStatus status={application.application_status} />
                  <Link
                    className="application-open"
                    to={`/dashboard/job-seeker/applications/${application.id}`}
                  >
                    View application ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {resource.data.pagination.total_pages > 1 && (
            <Pagination
              className="jobs-pagination"
              color="primary"
              siblingCount={0}
              count={resource.data.pagination.total_pages}
              page={page}
              onChange={(_event, next) =>
                setParams({ ...(status ? { status } : {}), page: String(next) })
              }
            />
          )}
        </>
      )}
    </>
  );
}
