import { lazy, Suspense } from "react";
import Loading from "../../components/ui/Loading";
import { Navigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLE_DETAILS, roleFromPath, roleHome } from "../../data/roles";
import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
import AuthSculpture from "../../components/experience/AuthSculpture";
const SeekerOverview = lazy(() => import("../seeker/SeekerOverview"));
const EmployerOverview = lazy(() => import("../employer/EmployerOverview"));
export default function DashboardHome() {
  const { rolePath } = useParams();
  const { user, activeRole } = useAuth();
  const role = roleFromPath(rolePath);
  if (!role || !user.roles.includes(role) || role !== activeRole)
    return <Navigate to={roleHome(activeRole)} replace />;
  if (role === "job_seeker")
    return (
      <Suspense fallback={<Loading />}>
        <SeekerOverview />
      </Suspense>
    );
  if (role === "employer")
    return (
      <Suspense fallback={<Loading />}>
        <EmployerOverview />
      </Suspense>
    );
  const details = ROLE_DETAILS[role];
  return (
    <>
      <Reveal className="dashboard-welcome">
        <span className="eyebrow">YOUR SPACE TO GROW</span>
        <p>Hello, {user.full_name || "there"}.</p>
      </Reveal>
      <section
        className="workspace-hero"
        style={{ "--workspace-accent": details.color }}
      >
        <div>
          <span className="workspace-pill">
            {details.label} / Your next chapter
          </span>
          <h1>{details.title}</h1>
          <p>{details.description}</p>
          <Button to={role === "trainer" ? "/courses" : "/jobs"}>
            {role === "trainer" ? "Explore learning" : "Explore opportunities"}{" "}
            ↗
          </Button>
        </div>
        <AuthSculpture compact />
      </section>
      <div className="dashboard-card-grid">
        <Reveal className="workspace-card">
          <span className="card-index">01 / IDENTITY</span>
          <h2>Uniquely you.</h2>
          <p>{user.email}</p>
          <p className="muted">
            Your account brings all your workspaces together.
          </p>
          <Button to="/dashboard/account" variant="outlined">
            View my account ↗
          </Button>
        </Reveal>
        <Reveal className="workspace-card workspace-card-lime" delay={0.08}>
          <span className="card-index">02 / POSSIBILITIES</span>
          <h2>More than one path.</h2>
          <p>
            You have {user.roles.length}{" "}
            {user.roles.length === 1 ? "workspace" : "workspaces"}.{" "}
            {user.roles.length > 1
              ? "Switch between them using the workspace menu."
              : "Your next chapter can start here."}
          </p>
          <div className="account-role-chips">
            {user.roles.map((item) => (
              <span key={item}>{ROLE_DETAILS[item].label}</span>
            ))}
          </div>
          {!user.roles.includes("trainer") && (
            <Button to="/dashboard/become-trainer" variant="outlined">
              Share your knowledge ↗
            </Button>
          )}
        </Reveal>
      </div>
      <section className="workspace-road-ahead">
        <span className="eyebrow">A LITTLE FURTHER AHEAD</span>
        <h2>Your workspace is taking shape.</h2>
        <p>
          Your account and workspace navigation are ready. Profile, management
          and activity tools are coming next.
        </p>
        <div>
          {details.modules.map((label, index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <h3>{label}</h3>
              <span>Coming soon ↗</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
