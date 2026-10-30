import "../../styles-jobs.css";
import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { jobService } from "../../services/jobService";
import {
  canApply,
  dateLabel,
  salary,
  words,
  externalUrl,
} from "../../utils/jobFormat";
import { asBoolean } from "../../utils/seekerFiles";
import OpportunityOrbit from "../../components/experience/OpportunityOrbit";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function ApplyLink({ job }) {
  const { user, isAuthenticated, activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const path = `/dashboard/job-seeker/apply/${job.id}`;
  if (!canApply(job))
    return (
      <p className="job-closed-message">
        This role is no longer accepting applications.
      </p>
    );
  if (!isAuthenticated)
    return (
      <Button to="/login" state={{ from: path }}>
        Sign in to apply ↗
      </Button>
    );
  if (!user.roles.includes("job_seeker"))
    return <p>Applications are available in a job seeker workspace.</p>;
  if (activeRole !== "job_seeker")
    return (
      <Button
        onClick={() => {
          switchRole("job_seeker");
          navigate(path);
        }}
      >
        Switch to job seeker & apply ↗
      </Button>
    );
  return <Button to={path}>Apply for this role ↗</Button>;
}
export default function JobDetails() {
  const { jobId } = useParams();
  const load = useCallback(
    (signal) => jobService.detail(jobId, signal),
    [jobId],
  );
  const skillsLoad = useCallback(
    (signal) => jobService.skills(jobId, signal),
    [jobId],
  );
  const resource = useApiResource(load);
  const skills = useApiResource(skillsLoad);
  if (resource.loading) return <Loading label="Opening this opportunity…" />;
  if (resource.error)
    return (
      <div className="page-container section-space">
        <ErrorState message={resource.error} onRetry={resource.reload} />
        <Button to="/jobs" variant="text">
          Back to jobs
        </Button>
      </div>
    );
  const job = resource.data;
  if (!job)
    return (
      <div className="page-container section-space">
        <h1>Job not found</h1>
        <Button to="/jobs">Explore other roles</Button>
      </div>
    );
  return (
    <div className="jobs-public">
      <section className="jobs-detail-hero">
        <div className="page-container">
          <Link className="jobs-back" to="/jobs">
            ← All opportunities
          </Link>
          <div className="jobs-detail-title">
            <div>
              <span className="eyebrow">{job.company_name}</span>
              <h1>{job.title}</h1>
              <div className="job-tags">
                <span>{job.location || "Location not specified"}</span>
                <span>{words(job.work_mode)}</span>
                <span>{words(job.job_type)}</span>
              </div>
            </div>
            <OpportunityOrbit />
          </div>
        </div>
      </section>
      <div className="page-container job-detail-layout">
        <div>
          <section className="jobs-panel">
            <span className="eyebrow">THE OPPORTUNITY</span>
            <h2>A little about the role.</h2>
            <p className="job-description">
              {job.description || "No description has been provided."}
            </p>
          </section>
          <section className="jobs-panel">
            <span className="eyebrow">WHAT YOU BRING</span>
            <h2>Skills that make a difference.</h2>
            {skills.loading ? (
              <Loading />
            ) : skills.error ? (
              <ErrorState message={skills.error} onRetry={skills.reload} />
            ) : !skills.data.length ? (
              <p>No required skills have been listed.</p>
            ) : (
              <div className="required-skills">
                {skills.data.map((skill) => (
                  <div key={skill.id || skill.skill_id}>
                    <strong>{skill.skill_name}</strong>
                    <span>
                      {asBoolean(skill.is_mandatory)
                        ? "Required"
                        : "Nice to have"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="jobs-panel company-summary">
            <span className="eyebrow">THE PEOPLE BEHIND THE ROLE</span>
            <h2>{job.company_name}</h2>
            <p>
              {[job.city, job.country].filter(Boolean).join(", ") ||
                "Company location not specified"}
            </p>
            {job.website_url && externalUrl(job.website_url) && (
              <a
                href={externalUrl(job.website_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Company website ↗
              </a>
            )}
          </section>
        </div>
        <aside className="job-apply-summary">
          <span className="eyebrow">YOUR NEXT MOVE</span>
          <h2>{salary(job)}</h2>
          <dl>
            {[
              ["Work mode", words(job.work_mode)],
              ["Job type", words(job.job_type)],
              ["Experience", words(job.experience_level)],
              ["Category", job.category_name || "Not specified"],
              [
                "Applications close",
                job.application_deadline
                  ? dateLabel(job.application_deadline)
                  : "No deadline listed",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <ApplyLink job={job} />
        </aside>
      </div>
    </div>
  );
}
