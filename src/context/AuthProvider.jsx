import { useCallback, useEffect, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_KEY,
  createSession,
  readSession,
  writeSession,
} from "../utils/authStorage";
import { authService } from "../services/authService";
function reducer(state, action) {
  if (action.type === "session")
    return { session: action.session, expired: false };
  if (action.type === "clear")
    return { session: null, expired: action.expired };
  return state;
}
export default function AuthProvider({ children }) {
  // useReducer keeps session replacement and expiry messages in one predictable flow.
  const [state, dispatch] = useReducer(reducer, null, () => ({
    session: readSession(),
    expired: false,
  }));
  const save = useCallback((session) => {
    writeSession(session);
    dispatch({ type: "session", session });
  }, []);
  const logout = useCallback((expired = false) => {
    writeSession(null);
    dispatch({ type: "clear", expired });
  }, []);
  useEffect(() => {
    const onExpired = () => logout(true);
    const onStorage = (event) => {
      if (event.key === AUTH_KEY || event.key === null)
        dispatch({ type: "session", session: readSession() });
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      window.removeEventListener("storage", onStorage);
    };
  }, [logout]);
  useEffect(() => {
    if (!state.session) return;
    let timer;
    const checkExpiry = () => {
      const remaining = state.session.expiresAt - Date.now();
      if (remaining <= 0) logout(true);
      else
        timer = window.setTimeout(checkExpiry, Math.min(remaining, 2147483647));
    };
    checkExpiry();
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        state.session.expiresAt <= Date.now()
      )
        logout(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state.session, logout]);
  async function login(values) {
    const result = await authService.login(values);
    const session = createSession(result.token, result.user);
    save(session);
    return session;
  }
  function switchRole(role) {
    if (!state.session?.user.roles.includes(role)) return false;
    save({ ...state.session, activeRole: role });
    return true;
  }
  async function becomeTrainer() {
    const previous = state.session;
    const result = await authService.becomeTrainer();
    // Ignore a response if this session was signed out or replaced in another tab.
    if (readSession()?.token !== previous.token)
      throw new Error("Your session changed. Please sign in again.");
    // This endpoint returns a refreshed token + roles, but no complete user object.
    const session = createSession(result.token, previous.user, "trainer");
    save(session);
    return session;
  }
  return (
    <AuthContext.Provider
      value={{
        user: state.session?.user || null,
        token: state.session?.token || null,
        activeRole: state.session?.activeRole || null,
        isAuthenticated: !!state.session,
        sessionExpired: state.expired,
        login,
        logout,
        switchRole,
        becomeTrainer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
