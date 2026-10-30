import "../../styles-seeker.css";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { seekerService } from "../../services/seekerService";
import { roleHome } from "../../data/roles";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
import Button from "../ui/Button";
function SeekerWorkspace() {
  const resource = useApiResource(seekerService.profile);
  const { pathname } = useLocation();
  const needsProfile = !resource.data && !pathname.endsWith("/profile");
  return (
    <div className="seeker-workspace">
      <nav className="seeker-tabs" aria-label="Job seeker tools">
        {[
          ["profile", "My profile"],
          ["education", "Education"],
          ["experience", "Experience"],
          ["skills", "Skills"],
          ["documents", "My documents"],
          ["resume-insights", "Resume insights"],
          ["applications", "My applications"],
        ].map(([path, label]) => (
          <NavLink key={path} to={`/dashboard/job-seeker/${path}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      {resource.loading ? (
        <Loading label="Opening your story…" />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : needsProfile ? (
        <section className="seeker-prerequisite">
          <span>LET'S START WITH YOU</span>
          <h1>
            A little introduction
            <br />
            goes a long way.
          </h1>
          <p>
            Create your profile first. Then add education, experience, skills
            and documents.
          </p>
          <Button to="/dashboard/job-seeker/profile">
            Create my profile ↗
          </Button>
        </section>
      ) : (
        <Outlet
          context={{ profile: resource.data, refreshProfile: resource.reload }}
        />
      )}
    </div>
  );
}
export default function SeekerLayout() {
  const { user, activeRole } = useAuth();
  // These routes are for the assigned, currently selected job seeker workspace.
  return user.roles.includes("job_seeker") && activeRole === "job_seeker" ? (
    <SeekerWorkspace />
  ) : (
    <Navigate to={roleHome(activeRole)} replace />
  );
}
