import "../../styles-jobs.css";
import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import { seekerService } from "../../services/seekerService";
import { applicationPayload, canApply, salary } from "../../utils/jobFormat";
import { asBoolean } from "../../utils/seekerFiles";
import { getApiError } from "../../utils/apiError";
import { showError, showSuccess } from "../../utils/alerts";
import ApplicationFields from "../../components/jobs/ApplicationFields";
import SeekerHeader from "../../components/seeker/SeekerHeader";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function ApplyForm({ job, resumes, onConflict }) {
  const navigate = useNavigate();
  const preferred =
    resumes.find(
      (doc) => asBoolean(doc.is_primary) && doc.document_type === "cv",
    ) || resumes.find((doc) => doc.document_type === "cv");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      resume_id: preferred ? String(preferred.id) : "",
      cover_letter: "",
    },
  });
  async function submit(values) {
    try {
      const result = await jobService.apply(job.id, applicationPayload(values));
      await showSuccess(
        "Your next chapter is in motion",
        "Your application has been submitted. Follow its progress in My applications.",
      );
      navigate(`/dashboard/job-seeker/applications/${result.application_id}`, {
        replace: true,
      });
    } catch (error) {
      await showError(getApiError(error));
      if (error.response?.status === 409) onConflict();
    }
  }
  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="jobs-panel">
      <h2>Make your introduction.</h2>
      <ApplicationFields
        control={control}
        resumes={resumes}
        disabled={isSubmitting}
      />
      <p className="jobs-form-link">
        <Link to="/dashboard/job-seeker/documents">
          Manage or upload documents ↗
        </Link>
      </p>
      <div className="application-submit">
        <p>You can edit or withdraw this application while it is pending.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending your application…" : "Submit application ↗"}
        </Button>
      </div>
    </form>
  );
}
export default function ApplyJob() {
  const { jobId } = useParams();
  const load = useCallback(
    async (signal) => {
      const [job, resumes, existing] = await Promise.all([
        jobService.detail(jobId, signal),
        seekerService.list("resumes", signal),
        jobService.applications({ job_id: jobId }, signal),
      ]);
      return { job, resumes, existing: existing.applications[0] };
    },
    [jobId],
  );
  const resource = useApiResource(load);
  if (resource.loading)
    return <Loading label="Getting your application ready…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const { job, resumes, existing } = resource.data;
  return (
    <>
      <SeekerHeader
        eyebrow="A LITTLE COURAGE. A NEW POSSIBILITY."
        title={
          <>
            Make your
            <br />
            next move.
          </>
        }
        description="Your experience. Your ambition. Your introduction to what's next."
      />
      <Link className="jobs-back dark" to={`/jobs/${jobId}`}>
        ← Back to job details
      </Link>
      <section className="apply-role-banner">
        <span>{job.company_name}</span>
        <h2>{job.title}</h2>
        <p>
          {job.location} · {salary(job)}
        </p>
      </section>
      {existing ? (
        <section className="jobs-panel">
          <h2>You've already made your move.</h2>
          <p>
            You already have an application for this role. View its status and
            available actions.
          </p>
          <Button to={`/dashboard/job-seeker/applications/${existing.id}`}>
            View my application ↗
          </Button>
        </section>
      ) : !canApply(job) ? (
        <section className="jobs-panel">
          <h2>This chapter has closed.</h2>
          <p>This role is no longer accepting applications.</p>
          <Button to="/jobs">Explore other opportunities ↗</Button>
        </section>
      ) : (
        <ApplyForm job={job} resumes={resumes} onConflict={resource.reload} />
      )}
    </>
  );
}
