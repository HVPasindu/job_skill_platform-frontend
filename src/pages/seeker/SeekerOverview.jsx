import "../../styles-jobs.css";
import { Link } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import useAuth from "../../hooks/useAuth";
import { jobService } from "../../services/jobService";
import { asBoolean } from "../../utils/seekerFiles";
import { dateLabel } from "../../utils/jobFormat";
import ApplicationStatus from "../../components/jobs/ApplicationStatus";
import OpportunityOrbit from "../../components/experience/OpportunityOrbit";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function SeekerOverview() {
  const resource = useApiResource(jobService.dashboard);
  const { user } = useAuth();
  if (resource.loading) return <Loading label="Finding your momentum…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const data = resource.data,
    total = Object.values(data.applications).reduce(
      (sum, value) => sum + Number(value),
      0,
    );
  return (
    <div className="seeker-overview">
      <p className="overview-greeting">
        Hello, {user.full_name || "there"}. <span>Let's keep you moving.</span>
      </p>
      <section className="overview-hero">
        <div>
          <span className="eyebrow">YOUR SPACE TO GROW</span>
          <h1>
            Good things
            <br />
            start with <em>a move.</em>
          </h1>
          <p>
            Bring your story together. Reach for the right role. Keep your next
            chapter in sight.
          </p>
          <Button to="/jobs">Explore opportunities ↗</Button>
        </div>
        <OpportunityOrbit />
      </section>
      <div className="overview-metrics">
        {[
          [total, "Applications", "/dashboard/job-seeker/applications"],
          [
            data.applications.pending || 0,
            "Pending",
            "/dashboard/job-seeker/applications?status=pending",
          ],
          [
            data.applications.shortlisted || 0,
            "Shortlisted",
            "/dashboard/job-seeker/applications?status=shortlisted",
          ],
          [
            data.applications.accepted || 0,
            "Accepted",
            "/dashboard/job-seeker/applications?status=accepted",
          ],
        ].map(([value, label, path]) => (
          <Link key={label} to={path}>
            <span>{label}</span>
            <strong>{value}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <div className="overview-foundation">
        <section className="jobs-panel">
          <span className="eyebrow">THE FOUNDATION FOR WHAT'S NEXT</span>
          <h2>
            {!data.profile
              ? "Start with your story."
              : asBoolean(data.profile.profile_completed)
                ? "Your introduction is ready."
                : "Give your profile a little more you."}
          </h2>
          <p>
            {data.profile
              ? "Keep your details and experience up to date for your next opportunity."
              : "Create your profile before you apply. Then add the experience and documents that make it yours."}
          </p>
          <div className="foundation-counts">
            {[
              ["education", "Education"],
              ["experience", "Experience"],
              ["skills", "Skills"],
              ["documents", "Documents"],
            ].map(([key, label]) => (
              <Link key={key} to={`/dashboard/job-seeker/${key}`}>
                <strong>{Number(data.counts[key]) || 0}</strong>
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <Button to="/dashboard/job-seeker/profile" variant="outlined">
            {data.profile ? "Update my profile ↗" : "Create my profile ↗"}
          </Button>
        </section>
        <section className="overview-shortcuts">
          <span className="eyebrow">A LITTLE MOMENTUM</span>
          <h2>
            Make space
            <br />
            for your next step.
          </h2>
          {[
            ["/jobs", "Find a role"],
            ["/dashboard/job-seeker/learning", "Continue learning"],
            ["/dashboard/job-seeker/sessions", "My mentorship sessions"],
            ["/dashboard/job-seeker/documents", "Update my documents"],
            [
              "/dashboard/job-seeker/resume-insights",
              "Explore resume insights",
            ],
          ].map(([path, label]) => (
            <Link key={path} to={path}>
              {label}
              <span>↗</span>
            </Link>
          ))}
        </section>
      </div>
      <section className="overview-recent">
        <div className="jobs-results-heading">
          <div>
            <span className="eyebrow">EVERY MOVE COUNTS</span>
            <h2>Recent applications.</h2>
          </div>
          <Link to="/dashboard/job-seeker/applications">View all ↗</Link>
        </div>
        {data.recent_applications.length ? (
          <div className="overview-recent-list">
            {data.recent_applications.map((application) => (
              <Link
                to={`/dashboard/job-seeker/applications/${application.id}`}
                key={application.id}
              >
                <div>
                  <span>{application.company_name}</span>
                  <h3>{application.job_title}</h3>
                  <small>{dateLabel(application.applied_at)}</small>
                </div>
                <ApplicationStatus status={application.application_status} />
              </Link>
            ))}
          </div>
        ) : (
          <section className="jobs-empty">
            <h2>Your first move is ahead.</h2>
            <p>You haven't submitted an application yet.</p>
            <Button to="/jobs">Find an opportunity ↗</Button>
          </section>
        )}
      </section>
    </div>
  );
}
