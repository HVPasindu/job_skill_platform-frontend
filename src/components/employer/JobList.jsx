import DataCollection from "../collections/DataCollection";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { employerService } from "../../services/employerService";
import { words, salary, dateLabel } from "../../utils/jobFormat";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import EmployerHeader from "./EmployerHeader";
import PageBar from "./PageBar";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
function Filters({ params, onApply }) {
  const [search, setSearch] = useState(params.get("search") || "");
  const [status, setStatus] = useState(params.get("status") || "");
  return (
    <form
      className="employer-filters"
      onSubmit={(event) => {
        event.preventDefault();
        onApply({ search: search.trim(), status });
      }}
    >
      <TextField
        label="Search job titles"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{ htmlInput: { maxLength: 150 } }}
      />
      <TextField
        select
        label="Job status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        {["draft", "open", "closed"].map((value) => (
          <MenuItem key={value} value={value}>
            {words(value)}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit">Filter →</Button>
      <button type="button" className="text-action" onClick={() => onApply({})}>
        Clear
      </button>
    </form>
  );
}
export default function JobList({ company }) {
  const load = useCallback(
    (params, signal) =>
      company
        ? employerService.jobs(company.id, params, signal)
        : employerService.managedJobs(params, signal),
    [company],
  );
  const resource = usePagedResource(load, 6);
  const [busy, setBusy] = useState(false);
  async function remove(job) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Delete this job permanently?",
          "This removes the job and may remove its applications/history. Close the job instead if you want to retain its records.",
          "Delete job",
        ))
      )
        return;
      await employerService.removeJob(job.id);
      resource.reload();
      await showSuccess("Job removed", "Your job list has been updated.");
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {company ? (
        <div className="seeker-toolbar">
          <div>
            <span className="eyebrow">YOUR COMPANY'S NEXT CHAPTER</span>
            <h1 className="employer-section-heading">Open a new door.</h1>
          </div>
          <Button to="new">Create job +</Button>
        </div>
      ) : (
        <EmployerHeader
          title={
            <>
              Your ideas.
              <br />
              <em>Your opportunities.</em>
            </>
          }
          description="Every opportunity across your companies. Choose a company to create a new role with your team."
        />
      )}
      <Filters
        key={resource.params.toString()}
        params={resource.params}
        onApply={resource.filter}
      />
      {!company && (
        <p className="seeker-inline-note">
          <Link to="/dashboard/employer/companies">
            Choose a company to create a new job ↗
          </Link>
        </p>
      )}
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.jobs.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Something great starts here.</h2>
          <p>No jobs on this page. Create a role or try different filters.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="employer-jobs"
          label="Managed jobs"
          className="employer-job-grid"
        >
          {resource.data.jobs.map((job) => {
            const base = `/dashboard/employer/companies/${job.company_id}/jobs/${job.id}`;
            return (
              <article className="employer-job-card" key={job.id}>
                <div className="employer-card-heading">
                  <span className={`job-state job-${job.status}`}>
                    {job.status}
                  </span>
                  <span>#{job.id}</span>
                </div>
                <h2>{job.title}</h2>
                <p>{job.company_name || company?.company_name}</p>
                <p>
                  {[job.location, words(job.job_type), words(job.work_mode)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <strong>{salary(job)}</strong>
                <p className="form-hint">
                  Deadline: {dateLabel(job.application_deadline)}
                </p>
                <div className="employer-job-actions">
                  <Link to={`${base}/edit`}>Edit & skills ↗</Link>
                  <Link to={`${base}/candidates`}>Candidates ↗</Link>
                  <button disabled={busy} onClick={() => remove(job)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Employer job pages"
      />
    </>
  );
}
