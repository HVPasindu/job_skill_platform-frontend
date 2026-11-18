import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import { employerService } from "../../services/employerService";
import { fileUrl } from "../../utils/seekerFiles";
import { dateLabel, words } from "../../utils/jobFormat";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import EmployerField from "./EmployerField";
import ApplicationStatus from "../jobs/ApplicationStatus";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
export default function CandidateDialog({ application, onClose, onSaved }) {
  const [status, setStatus] = useState(application.application_status);
  const [popup, setPopup] = useState(false);
  const load = useCallback(
    (signal) => jobService.history(application.id, signal),
    [application.id],
  );
  const history = useApiResource(load);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { application_status: status, note: "" } });
  async function submit(values) {
    setPopup(true);
    try {
      if (
        !(await confirmAction(
          "Update this application status?",
          `${application.full_name}: ${words(status)} → ${words(values.application_status)}. This change is recorded in the applicant's status history.`,
          "Update status",
        ))
      )
        return;
      await employerService.updateStatus(application.id, {
        application_status: values.application_status,
        note: values.note.trim(),
      });
      setStatus(values.application_status);
      reset({ application_status: values.application_status, note: "" });
      history.reload();
      onSaved();
      await showSuccess(
        "Application updated",
        "The candidate can see the new status and its history.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setPopup(false);
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      className="seeker-dialog employer-dialog"
      disableEnforceFocus={popup}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="candidate-title"
    >
      <DialogTitle id="candidate-title">{application.full_name}</DialogTitle>
      <DialogContent>
        <div className="candidate-intro">
          <div>
            <p>
              {application.job_title} · {application.company_name}
            </p>
            <p>{application.email}</p>
            <p>
              {[application.phone, application.city, application.country]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p>Applied {dateLabel(application.applied_at)}</p>
          </div>
          <ApplicationStatus status={status} />
        </div>
        <section className="candidate-cover">
          <h3>Cover letter.</h3>
          <p>{application.cover_letter || "No cover letter was submitted."}</p>
          {fileUrl(application.resume_file_url) ? (
            <a
              href={fileUrl(application.resume_file_url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open attached resume: {application.resume_file_name} ↗
            </a>
          ) : (
            <p>No resume attached.</p>
          )}
        </section>
        {status === "withdrawn" ? (
          <p className="form-notice">
            This candidate withdrew. The application cannot be reopened by an
            employer.
          </p>
        ) : (
          <form
            id="candidate-status-form"
            noValidate
            onSubmit={handleSubmit(submit)}
          >
            <h3>Move the conversation forward.</h3>
            <div className="seeker-form-grid">
              <EmployerField
                definition={{
                  name: "application_status",
                  label: "Application status",
                  required: true,
                  options: [
                    "pending",
                    "reviewed",
                    "shortlisted",
                    "accepted",
                    "rejected",
                  ],
                }}
                control={control}
                disabled={isSubmitting}
              />
              <EmployerField
                definition={{
                  name: "note",
                  label: "Status note (visible to candidate)",
                  multiline: true,
                  rows: 3,
                  max: 10000,
                  wide: true,
                }}
                control={control}
                disabled={isSubmitting}
              />
            </div>
          </form>
        )}
        <section className="candidate-history">
          <h3>Status history.</h3>
          {history.loading ? (
            <Loading />
          ) : history.error ? (
            <ErrorState message={history.error} onRetry={history.reload} />
          ) : !history.data.length ? (
            <p>No history yet.</p>
          ) : (
            <ol>
              {history.data.map((item) => (
                <li key={item.id}>
                  <ApplicationStatus status={item.new_status} />
                  <p>
                    {item.old_status
                      ? `${words(item.old_status)} → ${words(item.new_status)}`
                      : "Application submitted"}
                  </p>
                  {item.note && <p>{item.note}</p>}
                  <small>
                    {dateLabel(item.changed_at)}
                    {item.changed_by_name ? ` · ${item.changed_by_name}` : ""}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </section>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        {status !== "withdrawn" && (
          <Button
            type="submit"
            form="candidate-status-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating…" : "Save status →"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
