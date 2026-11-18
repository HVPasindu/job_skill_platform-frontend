// jwt-decode reads expiry and role claims; it does NOT verify a JWT signature.
// The backend verifies signatures and remains responsible for all authorization.
import { jwtDecode } from "jwt-decode";
import { ROLE_DETAILS } from "../data/roles";
export const AUTH_KEY = "skilljob.auth";
export const AUTH_EXPIRED_EVENT = "skilljob:auth-expired";
export function createSession(token, user, preferredRole) {
  const claims = jwtDecode(token);
  if (
    !claims.id ||
    !Number.isFinite(claims.exp) ||
    claims.exp * 1000 <= Date.now()
  )
    throw new Error("Your session has expired. Please sign in again.");
  const roles = Array.isArray(claims.roles)
    ? [
        ...new Set(
          claims.roles.filter((role) => Object.hasOwn(ROLE_DETAILS, role)),
        ),
      ]
    : [];
  return {
    token,
    expiresAt: claims.exp * 1000,
    user: {
      id: claims.id,
      email: claims.email || user?.email || "",
      full_name: user?.full_name || "",
      roles,
      companies: Array.isArray(user?.companies) ? user.companies : [],
    },
    activeRole: roles.includes(preferredRole)
      ? preferredRole
      : roles[0] || null,
  };
}
export function readSession() {
  try {
    const value = JSON.parse(localStorage.getItem(AUTH_KEY));
    return value?.token
      ? createSession(value.token, value.user, value.activeRole)
      : null;
  } catch {
    return null;
  }
}
export function writeSession(session) {
  if (session) localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_KEY);
  // Remove the old Step 01 token key; all requests now use the same session record.
  localStorage.removeItem("token");
}
export function getStoredToken() {
  return readSession()?.token || null;
}
