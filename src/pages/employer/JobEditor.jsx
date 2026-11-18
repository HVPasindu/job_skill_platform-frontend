import { useCallback } from "react";
import {
  Link,
  useOutletContext,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import { employerService } from "../../services/employerService";
import { jobFields, jobPayload } from "../../data/employerFields";
import EmployerField from "../../components/employer/EmployerField";
import JobSkills from "../../components/employer/JobSkills";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Form({ company, job, options, categories, onSaved }) {
  const fields = jobFields(options, categories);
  const defaults = Object.fromEntries(
    fields.map((field) => [field.name, job?.[field.name] ?? ""]),
  );
  defaults.status =
    job?.status ||
    (options.statuses.includes("draft") ? "draft" : options.statuses[0]);
  defaults.job_category_id = job?.job_category_id
    ? String(job.job_category_id)
    : "";
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });
  const navigate = useNavigate();
  async function submit(values) {
    if (
      values.salary_min !== "" &&
      values.salary_max !== "" &&
      Number(values.salary_min) > Number(values.salary_max)
    ) {
      setError("salary_max", {
        message: "Maximum salary must be at least the minimum salary.",
      });
      return;
    }
    try {
      const response = await employerService.saveJob(
        { ...jobPayload(values), ...(job ? {} : { company_id: company.id }) },
        job?.id,
      );
      await showSuccess(
        job ? "Opportunity updated" : "A new door is ready",
        job
          ? "Your job details have been saved."
          : "Add the required skills below. Set the job to open when it is ready for candidates.",
      );
      if (job) onSaved();
      else
        navigate(
          `/dashboard/employer/companies/${company.id}/jobs/${response.job_id}/edit`,
          { replace: true },
        );
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <form className="seeker-panel" noValidate onSubmit={handleSubmit(submit)}>
      <div className="seeker-form-grid">
        {fields.map((field) => (
          <EmployerField
            key={field.name}
            definition={field}
            control={control}
            disabled={isSubmitting}
          />
        ))}
      </div>
      <div className="seeker-form-actions">
        <p>
          Use draft while preparing. Open roles appear publicly until their
          deadline.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving your opportunity…"
            : job
              ? "Save job →"
              : "Create job →"}
        </Button>
      </div>
    </form>
  );
}
function ExistingJob({ company, jobId, options, categories }) {
  const load = useCallback(
    (signal) => employerService.job(company.id, jobId, signal),
    [company.id, jobId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  return (
    <>
      <Form
        company={company}
        job={resource.data}
        options={options}
        categories={categories}
        onSaved={resource.reload}
      />
      <JobSkills jobId={jobId} />
      <div className="employer-quick-links">
        <Link
          to={`/dashboard/employer/companies/${company.id}/jobs/${jobId}/candidates`}
        >
          View candidates ↗
        </Link>
        <Link to={`/jobs/${jobId}`}>Preview public job page ↗</Link>
      </div>
    </>
  );
}
export default function JobEditor() {
  const { company } = useOutletContext();
  const { jobId } = useParams();
  const options = useApiResource(employerService.jobOptions);
  const categories = useApiResource(jobService.categories);
  return (
    <>
      <Link
        className="jobs-back dark"
        to={`/dashboard/employer/companies/${company.id}/jobs`}
      >
        ← Company jobs
      </Link>
      <div className="employer-editor-heading">
        <span className="eyebrow">A ROLE WORTH STEPPING INTO</span>
        <h1>{jobId ? "Shape the opportunity." : "Make room for potential."}</h1>
        <p>
          {jobId
            ? "Update the details. Make the next step clearer."
            : "Start with the role. Add your skills after saving."}
        </p>
      </div>
      {options.loading || categories.loading ? (
        <Loading />
      ) : options.error || categories.error ? (
        <ErrorState
          message={options.error || categories.error}
          onRetry={() => {
            options.reload();
            categories.reload();
          }}
        />
      ) : jobId ? (
        <ExistingJob
          company={company}
          jobId={jobId}
          options={options.data}
          categories={categories.data}
        />
      ) : (
        <Form
          company={company}
          options={options.data}
          categories={categories.data}
        />
      )}
    </>
  );
}
