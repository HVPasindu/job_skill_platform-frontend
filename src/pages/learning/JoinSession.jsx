import "../../styles-learning.css";
import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import { mentorshipService } from "../../services/learningService";
import { canJoin, capacity, clock } from "../../utils/learningFormat";
import { dateLabel } from "../../utils/jobFormat";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import useAuth from "../../hooks/useAuth";
export default function JoinSession() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const load = useCallback(
    (signal) => mentorshipService.session(sessionId, signal),
    [sessionId],
  );
  const resource = useApiResource(load);
  async function join() {
    setBusy(true);
    try {
      await mentorshipService.join(sessionId);
      await showSuccess(
        "A good conversation is on your calendar",
        "Your seat is reserved.",
      );
      navigate(`/sessions/${sessionId}`, { replace: true });
    } catch (error) {
      await showError(getApiError(error));
      resource.reload();
    } finally {
      setBusy(false);
    }
  }
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const s = resource.data;
  return (
    <section className="seeker-panel join-session-panel">
      <span className="eyebrow">YOUR NEXT CONVERSATION</span>
      <h1>{s.title}</h1>
      <p className="learning-copy">
        {dateLabel(s.session_date)} · {clock(s.start_time)}–{clock(s.end_time)}
      </p>
      <p className="learning-copy">{capacity(s)}</p>
      {Number(s.trainer_user_id) === Number(user.id) ? (
        <p>You cannot join your own session.</p>
      ) : Number(s.is_joined) ? (
        <Button to="/dashboard/job-seeker/sessions">Open my sessions ↗</Button>
      ) : canJoin(s) ? (
        <Button disabled={busy} onClick={join}>
          {busy ? "Reserving your seat…" : "Confirm join →"}
        </Button>
      ) : (
        <p>This session is full, already started, or no longer scheduled.</p>
      )}
      <p className="learning-inline-note">
        <Link to={`/sessions/${s.id}`}>Back to session details ↗</Link>
      </p>
    </section>
  );
}
