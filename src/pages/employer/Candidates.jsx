import DataCollection from "../../components/collections/DataCollection";
import { useCallback, useState } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import { employerService } from "../../services/employerService";
import usePagedResource from "../../hooks/usePagedResource";
import useApiResource from "../../hooks/useApiResource";
import { APPLICATION_STATUSES, words, dateLabel } from "../../utils/jobFormat";
import CandidateDialog from "../../components/employer/CandidateDialog";
import EmployerHeader from "../../components/employer/EmployerHeader";
import PageBar from "../../components/employer/PageBar";
import ApplicationStatus from "../../components/jobs/ApplicationStatus";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function Filters({ resource, global }) {
  const [status, setStatus] = useState(resource.params.get("status") || "");
  const [search, setSearch] = useState(resource.params.get("search") || "");
  return (
    <form
      className="employer-filters"
      onSubmit={(event) => {
        event.preventDefault();
        resource.filter({
          status,
          ...(global ? { search: search.trim() } : {}),
        });
      }}
    >
      {global && (
        <TextField
          label="Search candidate, job or company"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 150 } }}
        />
      )}
      <TextField
        select
        label="Application status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        {APPLICATION_STATUSES.map((value) => (
          <MenuItem key={value} value={value}>
            {words(value)}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit">Filter →</Button>
      <button
        type="button"
        className="text-action"
        onClick={() => resource.filter({})}
      >
        Clear
      </button>
    </form>
  );
}
function List({ job, company }) {
  const load = useCallback(
    (params, signal) =>
      job
        ? employerService.jobCandidates(job.id, params, signal)
        : employerService.candidates(params, signal),
    [job],
  );
  const resource = usePagedResource(load, 8);
  const [selected, setSelected] = useState(null);
  return (
    <>
      {job ? (
        <>
          <Link
            className="jobs-back dark"
            to={`/dashboard/employer/companies/${company.id}/jobs`}
          >
            ← Company jobs
          </Link>
          <div className="employer-editor-heading">
            <span className="eyebrow">THE PEOPLE BEHIND YOUR NEXT CHAPTER</span>
            <h1>{job.title}</h1>
            <p>Meet the candidates. Keep the next step clear.</p>
          </div>
        </>
      ) : (
        <EmployerHeader
          title={
            <>
              Great potential.
              <br />
              <em>Real people.</em>
            </>
          }
          description="Applications across the companies you belong to. Find a fit and keep every conversation moving."
        />
      )}
      <Filters
        key={resource.params.toString()}
        resource={resource}
        global={!job}
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.applications.length ? (
        <section className="seeker-empty">
          <span>✦</span>
          <h2>A new connection is on its way.</h2>
          <p>No applications match this page or these filters.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="employer-candidates"
          label="Candidate results"
          className="candidate-list"
          defaultView="list"
        >
          {resource.data.applications.map((application) => (
            <article className="candidate-card" key={application.id}>
              <span className="team-avatar">
                {application.full_name.charAt(0)}
              </span>
              <div>
                <h2>{application.full_name}</h2>
                <p>{application.email}</p>
                <p>
                  {job?.title || application.job_title} ·{" "}
                  {company?.company_name || application.company_name}
                </p>
                <small>Applied {dateLabel(application.applied_at)}</small>
              </div>
              <div>
                <ApplicationStatus status={application.application_status} />
                <button
                  onClick={() =>
                    setSelected({
                      ...application,
                      job_title: job?.title || application.job_title,
                      company_name:
                        company?.company_name || application.company_name,
                    })
                  }
                >
                  Review application ↗
                </button>
              </div>
            </article>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Candidate pages"
      />
      {selected && (
        <CandidateDialog
          application={selected}
          onClose={() => setSelected(null)}
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
function JobCandidates() {
  const { company } = useOutletContext();
  const { jobId } = useParams();
  const load = useCallback(
    (signal) => employerService.job(company.id, jobId, signal),
    [company.id, jobId],
  );
  const job = useApiResource(load);
  return job.loading ? (
    <Loading />
  ) : job.error ? (
    <ErrorState message={job.error} onRetry={job.reload} />
  ) : (
    <List company={company} job={job.data} />
  );
}
export default function Candidates() {
  const { jobId } = useParams();
  return jobId ? <JobCandidates /> : <List />;
}
