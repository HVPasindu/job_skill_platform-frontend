import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
// MUI Drawer handles mobile focus/escape; ListItemButton gives consistent menu states.
import { Drawer, IconButton, ListItemButton } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useAuth from "../../hooks/useAuth";
import RoleSwitcher from "../dashboard/RoleSwitcher";
import { ROLE_DETAILS, roleHome } from "../../data/roles";
import { confirmAction } from "../../utils/alerts";
export default function DashboardLayout() {
  const { user, activeRole, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  const role = ROLE_DETAILS[activeRole];
  const seekerPaths = {
    "My profile": "profile",
    "My documents": "documents",
    "My applications": "applications",
  };
  const employerPaths = {
    "My companies": "companies",
    "Manage jobs": "jobs",
    Candidates: "candidates",
  };
  async function signOut() {
    setOpen(false);
    if (
      await confirmAction(
        "Ready to head out?",
        "You can sign back in whenever you're ready.",
        "Sign out",
      )
    ) {
      logout();
      navigate("/login", { replace: true });
    }
  }
  function sidebar(mobile = false) {
    return (
      <div className="dashboard-sidebar-inner">
        <div className="dashboard-brand-row">
          <Link className="brand" to="/" aria-label="SkillJob home">
            <span className="brand-mark">↗</span>skilljob.
          </Link>
          {mobile && (
            <IconButton
              aria-label="Close workspace menu"
              onClick={() => setOpen(false)}
            >
              <CloseRoundedIcon />
            </IconButton>
          )}
        </div>
        <p className="eyebrow">MAKE ROOM FOR WHAT'S NEXT</p>
        <RoleSwitcher onSwitch={() => setOpen(false)} />
        <nav aria-label="Workspace navigation" className="dashboard-links">
          <ListItemButton
            component={NavLink}
            to={roleHome(activeRole)}
            selected={location.pathname === roleHome(activeRole)}
            onClick={() => setOpen(false)}
          >
            ◈ <span>Overview</span>
          </ListItemButton>
          <ListItemButton
            component={NavLink}
            to="/dashboard/account"
            selected={location.pathname === "/dashboard/account"}
            onClick={() => setOpen(false)}
          >
            ◎ <span>My account</span>
          </ListItemButton>
          {role?.modules.map((label) =>
            activeRole === "job_seeker" && seekerPaths[label] ? (
              <ListItemButton
                key={label}
                component={NavLink}
                to={`/dashboard/job-seeker/${seekerPaths[label]}`}
                selected={
                  location.pathname ===
                  `/dashboard/job-seeker/${seekerPaths[label]}`
                }
                onClick={() => setOpen(false)}
              >
                <span>↗</span>
                <span>{label}</span>
              </ListItemButton>
            ) : activeRole === "employer" && employerPaths[label] ? (
              <ListItemButton
                key={label}
                component={NavLink}
                to={`/dashboard/employer/${employerPaths[label]}`}
                selected={location.pathname.startsWith(
                  `/dashboard/employer/${employerPaths[label]}`,
                )}
                onClick={() => setOpen(false)}
              >
                <span>↗</span>
                <span>{label}</span>
              </ListItemButton>
            ) : (
              <ListItemButton key={label} disabled>
                <span>↗</span>
                <span>{label}</span>
                <small>Soon</small>
              </ListItemButton>
            ),
          )}
          {!user.roles.includes("trainer") && (
            <ListItemButton
              component={NavLink}
              to="/dashboard/become-trainer"
              selected={location.pathname === "/dashboard/become-trainer"}
              onClick={() => setOpen(false)}
            >
              ✦ <span>Become a trainer</span>
            </ListItemButton>
          )}
        </nav>
        <div className="dashboard-sidebar-bottom">
          <Link to="/jobs">Explore opportunities ↗</Link>
          <button type="button" onClick={signOut}>
            Sign out ↗
          </button>
          <span>Small steps. Big futures.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="dashboard-sidebar">{sidebar()}</aside>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { className: "dashboard-mobile-drawer" } }}
      >
        {sidebar(true)}
      </Drawer>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <IconButton
              className="dashboard-menu-button"
              aria-label="Open workspace menu"
              onClick={() => setOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
            <span>{role?.label || "Your account"} workspace</span>
          </div>
          <Link to="/dashboard/account" className="dashboard-user">
            <span className="dashboard-avatar">
              {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
            </span>
            <span>{user.full_name || "My account"}</span>
          </Link>
        </header>
        <main
          id="main-content"
          className="dashboard-content"
          key={location.pathname}
        >
          <Outlet />
        </main>
        <footer className="dashboard-footer">
          <span>Keep your ambition moving.</span>
          <Link to="/">skilljob. ↗</Link>
        </footer>
      </div>
    </div>
  );
}
