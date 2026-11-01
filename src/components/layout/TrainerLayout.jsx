import "../../styles-seeker.css";
import "../../styles-trainer.css";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { courseService } from "../../services/courseService";
import { roleHome } from "../../data/roles";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
import Button from "../ui/Button";
function Workspace() {
  const profile = useApiResource(courseService.profile);
  const location = useLocation();
  if (profile.loading) return <Loading label="Opening your trainer studio…" />;
  if (profile.error)
    return <ErrorState message={profile.error} onRetry={profile.reload} />;
  return (
    <div className="trainer-workspace">
      <nav className="seeker-tabs" aria-label="Trainer tools">
        {[
          ["profile", "Trainer profile"],
          ["courses", "My courses"],
          ["categories", "Course categories"],
          ["students", "My students"],
          ["sessions", "My sessions"],
        ].map(([path, label]) => (
          <NavLink key={path} to={`/dashboard/trainer/${path}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      {!profile.data && !location.pathname.endsWith("/profile") ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h1>Let them meet their next mentor.</h1>
          <p>Create your trainer profile before building your first course.</p>
          <Button to="/dashboard/trainer/profile">
            Create trainer profile ↗
          </Button>
        </section>
      ) : (
        <Outlet
          context={{ profile: profile.data, reloadProfile: profile.reload }}
        />
      )}
    </div>
  );
}
export default function TrainerLayout() {
  const { user, activeRole } = useAuth();
  return user.roles.includes("trainer") && activeRole === "trainer" ? (
    <Workspace />
  ) : (
    <Navigate to={roleHome(activeRole)} replace />
  );
}
