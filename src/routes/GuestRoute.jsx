import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { roleHome } from "../data/roles";
export default function GuestRoute() {
  const { isAuthenticated, activeRole } = useAuth();
  return isAuthenticated ? (
    <Navigate to={roleHome(activeRole)} replace />
  ) : (
    <Outlet />
  );
}
