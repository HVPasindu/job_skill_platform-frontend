import DataCollection from "../../components/collections/DataCollection";
import "../../styles-seeker.css";
import "../../styles-employer.css";
import { Link } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import useAuth from "../../hooks/useAuth";
import { employerService } from "../../services/employerService";
import EmployerSculpture from "../../components/experience/EmployerSculpture";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function EmployerOverview() {
  const { user } = useAuth();
  const resource = useApiResource(employerService.dashboard);
  if (resource.loading)
    return <Loading label="Finding your team's momentum…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const data = resource.data;
  return (
    <>
      <p className="employer-greeting">
        Hello, {user.full_name || "there"}. Let's build what's next.
      </p>
      <section className="employer-overview-hero">
        <div>
          <span className="eyebrow">GOOD PEOPLE. GREAT POSSIBILITIES.</span>
          <h1>
            Build the team.
            <br />
            <em>Shape the future.</em>
          </h1>
          <p>
            Your companies, opportunities and next great teammates. All moving
            forward together.
          </p>
          <Button to="/dashboard/employer/companies">
            Open my companies ↗
          </Button>
        </div>
        <EmployerSculpture />
      </section>
      <div className="employer-metrics">
        {[
          ["Companies", data.companies.total, "companies"],
          ["Live opportunities", data.jobs.live, "jobs"],
          ["Applications", data.applications.total, "candidates"],
          [
            "Awaiting review",
            data.applications.pending,
            "candidates?status=pending",
          ],
        ].map(([label, value, path]) => (
          <Link to={`/dashboard/employer/${path}`} key={label}>
            <span>{label}</span>
            <strong>{Number(value) || 0}</strong>
            <span>Explore ↗</span>
          </Link>
        ))}
      </div>
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">YOUR TEAM'S LATEST OPPORTUNITIES</span>
          <h2>Keep things moving.</h2>
        </div>
        <Link to="/dashboard/employer/companies">All companies ↗</Link>
      </div>
      <DataCollection
        viewKey="employer-recent"
        label="Recent job postings"
        className="employer-recent"
        defaultView="list"
      >
        {!data.recent_jobs.length ? (
          <p>No jobs yet. Choose a company and create your first role.</p>
        ) : (
          data.recent_jobs.map((job) => (
            <Link
              key={job.id}
              to={`/dashboard/employer/companies/${job.company_id}/jobs/${job.id}/edit`}
            >
              <div>
                <h3>{job.title}</h3>
                <p>{job.company_name}</p>
              </div>
              <span className={`job-state job-${job.status}`}>
                {job.status}
              </span>
              <span>↗</span>
            </Link>
          ))
        )}
      </DataCollection>
    </>
  );
}
