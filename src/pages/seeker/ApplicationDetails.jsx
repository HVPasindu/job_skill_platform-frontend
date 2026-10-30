import "../../styles-jobs.css";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import { dateLabel, words } from "../../utils/jobFormat";
import { fileUrl } from "../../utils/seekerFiles";
import { getApiError } from "../../utils/apiError";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import ApplicationStatus from "../../components/jobs/ApplicationStatus";
import ApplicationEditor from "../../components/jobs/ApplicationEditor";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function ApplicationDetails() {
  const { applicationId } = useParams();
  const load = useCallback(
    (signal) => jobService.application(applicationId, signal),
    [applicationId],
  );
  const historyLoad = useCallback(
    (signal) => jobService.history(applicationId, signal),
    [applicationId],
  );
  const resource = useApiResource(load),
    history = useApiResource(historyLoad);
  const [editing, setEditing] = useState(false),
    [busy, setBusy] = useState(false);
  function reload() {
    resource.reload();
    history.reload();
  }
  async function withdraw() {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Withdraw this application?",
          "This marks your pending application as withdrawn. You cannot edit or submit another application for this role afterward.",
          "Withdraw application",
        ))
      )
        return;
      await jobService.withdraw(applicationId);
      reload();
      await showSuccess(
        "Application withdrawn",
        "Your application status and history have been updated.",
      );
    } catch (error) {
      await showError(getApiError(error));
      reload();
    } finally {
      setBusy(false);
    }
  }
  if (resource.loading) return <Loading label="Opening your application…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const application = resource.data;
  return (
    <>
      <Link className="jobs-back dark" to="/dashboard/job-seeker/applications">
        ← My applications
      </Link>
      <section className="application-detail-heading">
        <div>
          <span className="eyebrow">
            {application.company_name} / APPLICATION #{application.id}
          </span>
          <h1>{application.job_title}</h1>
          <p>
            Applied {dateLabel(application.applied_at)} ·{" "}
            {application.location || "Location not specified"}
          </p>
        </div>
        <ApplicationStatus status={application.application_status} />
      </section>
      <div className="application-detail-grid">
        <div>
          <section className="jobs-panel">
            <h2>Your introduction.</h2>
            <p className="job-description">
              {application.cover_letter ||
                "You submitted this application without a cover letter."}
            </p>
            <div className="application-attachment">
              <span>Resume attachment</span>
              {application.resume_file_name ? (
                fileUrl(application.resume_file_url) ? (
                  <a
                    href={fileUrl(application.resume_file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {application.resume_file_name} ↗
                  </a>
                ) : (
                  <strong>{application.resume_file_name}</strong>
                )
              ) : (
                <p>No document attached.</p>
              )}
            </div>
            <div className="application-detail-actions">
              {application.application_status === "pending" ? (
                <>
                  <Button disabled={busy} onClick={() => setEditing(true)}>
                    Edit application ↗
                  </Button>
                  <Button variant="outlined" disabled={busy} onClick={withdraw}>
                    {busy ? "Updating…" : "Withdraw application"}
                  </Button>
                </>
              ) : (
                <p>
                  Editing and withdrawal are available only while an application
                  is pending.
                </p>
              )}
            </div>
            <Link
              className="application-job-link"
              to={`/jobs/${application.job_id}`}
            >
              View original job ↗
            </Link>
          </section>
        </div>
        <aside className="jobs-panel application-history">
          <span className="eyebrow">YOUR JOURNEY / LATEST FIRST</span>
          <h2>Status history.</h2>
          {history.loading ? (
            <Loading />
          ) : history.error ? (
            <ErrorState message={history.error} onRetry={history.reload} />
          ) : !history.data.length ? (
            <p>No status history has been recorded.</p>
          ) : (
            <ol>
              {history.data.map((item) => (
                <li key={item.id}>
                  <span className="timeline-dot" />
                  <ApplicationStatus status={item.new_status} />
                  <p>
                    {item.old_status
                      ? `${words(item.old_status)} → ${words(item.new_status)}`
                      : "Application submitted"}
                  </p>
                  {item.note && <p className="history-note">{item.note}</p>}
                  <small>
                    {dateLabel(item.changed_at)}
                    {item.changed_by_name ? ` · ${item.changed_by_name}` : ""}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
      {editing && (
        <ApplicationEditor
          application={application}
          onClose={() => setEditing(false)}
          onSaved={reload}
        />
      )}
    </>
  );
}
