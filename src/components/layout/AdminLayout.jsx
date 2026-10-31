import "../../styles-admin.css";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { roleHome } from "../../data/roles";
export default function AdminLayout() {
  const { user, activeRole } = useAuth();
  if (!user?.roles.includes("admin") || activeRole !== "admin")
    return <Navigate to={roleHome(activeRole)} replace />;
  return (
    <div className="admin-workspace">
      <nav className="admin-tabs" aria-label="Administrator tools">
        <NavLink to="/dashboard/admin" end>
          Overview
        </NavLink>
        <NavLink to="/dashboard/admin/categories">Job categories</NavLink>
        <NavLink to="/dashboard/admin/chatbot-logs">Chatbot logs</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
