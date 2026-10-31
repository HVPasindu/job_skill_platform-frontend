import { useCallback } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { mentorshipService } from "../../services/learningService";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
export default function TrainerSessionLayout() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const load = useCallback(
    (signal) => mentorshipService.session(sessionId, signal),
    [sessionId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const session = resource.data;
  if (Number(session.trainer_user_id) !== Number(user.id))
    return (
      <ErrorState message="This mentorship session belongs to another trainer." />
    );
  const base = `/dashboard/trainer/sessions/${sessionId}`;
  return (
    <>
      <Link className="trainer-back" to="/dashboard/trainer/sessions">
        ← My mentorship sessions
      </Link>
      <div className="trainer-course-context">
        <div>
          <span className="eyebrow">
            YOUR MENTORSHIP SESSION / {session.status}
          </span>
          <h2>{session.title}</h2>
        </div>
        <Link to={`/sessions/${sessionId}`}>Preview session ↗</Link>
      </div>
      <nav className="trainer-course-tabs" aria-label="Session tools">
        <NavLink to={`${base}/edit`}>Session details</NavLink>
        <NavLink to={`${base}/participants`}>Participants</NavLink>
      </nav>
      <Outlet context={{ session, reloadSession: resource.reload }} />
    </>
  );
}
