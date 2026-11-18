import "../../styles-seeker.css";
import "../../styles-jobs.css";
import "../../styles-employer.css";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { roleHome } from "../../data/roles";
export default function EmployerLayout() {
  const { user, activeRole } = useAuth();
  if (!user.roles.includes("employer") || activeRole !== "employer")
    return <Navigate to={roleHome(activeRole)} replace />;
  return (
    <div className="employer-workspace">
      <nav className="seeker-tabs" aria-label="Employer tools">
        {[
          ["companies", "My companies"],
          ["jobs", "Manage jobs"],
          ["candidates", "Candidates"],
        ].map(([path, label]) => (
          <NavLink key={path} to={`/dashboard/employer/${path}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
