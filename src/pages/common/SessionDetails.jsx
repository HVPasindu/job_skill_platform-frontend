import "../../styles-seeker.css";
import "../../styles-learning.css";
import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { mentorshipService } from "../../services/learningService";
import { canJoin, capacity, clock } from "../../utils/learningFormat";
import { dateLabel, externalUrl } from "../../utils/jobFormat";
import StatusPill from "../../components/learning/StatusPill";
import GrowthOrbit from "../../components/experience/GrowthOrbit";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function SessionDetails() {
  const { sessionId } = useParams();
  const { user, activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const load = useCallback(
    (signal) => mentorshipService.session(sessionId, signal),
    [sessionId],
  );
  const resource = useApiResource(load);
  if (resource.loading)
    return (
      <div className="page-container section-space">
        <Loading />
      </div>
    );
  if (resource.error)
    return (
      <div className="page-container section-space">
        <ErrorState message={resource.error} onRetry={resource.reload} />
        <Button to="/sessions">Explore sessions ↗</Button>
      </div>
    );
  const s = resource.data;
  const owner = Number(user?.id) === Number(s.trainer_user_id);
  const destination = `/dashboard/job-seeker/sessions/${s.id}/join`;
  return (
    <div className="page-container section-space">
      <Link className="learning-back" to="/sessions">
        ← All mentorship sessions
      </Link>
      <section className="session-detail-hero">
        <div>
          <span className="eyebrow">A NEW PERSPECTIVE STARTS HERE</span>
          <h1>{s.title}</h1>
          <p>With {s.trainer_name}</p>
          <StatusPill status={s.status} />
        </div>
        <GrowthOrbit />
      </section>
      <div className="session-detail-grid">
        <section className="seeker-panel">
          <h2>A little about the conversation.</h2>
          <p className="learning-copy">
            {s.description || "Bring your questions and an open mind."}
          </p>
          {s.course_title && (
            <p className="learning-copy">
              Related course:{" "}
              <Link to={`/courses/${s.course_id}`}>{s.course_title} ↗</Link>
            </p>
          )}
        </section>
        <aside className="session-booking">
          <h2>Make room for the next step.</h2>
          <p>{dateLabel(s.session_date)}</p>
          <p>
            {clock(s.start_time)}–{clock(s.end_time)}
          </p>
          <p>{capacity(s)}</p>
          {owner ? (
            <>
              <p>You host this session.</p>
              {activeRole === "trainer" && (
                <Button to={`/dashboard/trainer/sessions/${s.id}/edit`}>
                  Manage session ↗
                </Button>
              )}
            </>
          ) : Number(s.is_joined) ? (
            <>
              <p>Your seat is reserved.</p>
              {activeRole === "job_seeker" && (
                <Button to="/dashboard/job-seeker/sessions">
                  My sessions ↗
                </Button>
              )}
            </>
          ) : !canJoin(s) ? (
            <p>
              {s.status !== "scheduled"
                ? "This session is no longer open for joining."
                : Number(s.started)
                  ? "This session has already started."
                  : "This session is full."}
            </p>
          ) : !user ? (
            <Link
              className="learning-signin"
              to="/login"
              state={{ from: { pathname: destination } }}
            >
              Sign in to join ↗
            </Link>
          ) : !user.roles.includes("job_seeker") ? (
            <p>Joining is available through a job seeker account.</p>
          ) : activeRole !== "job_seeker" ? (
            <Button
              onClick={() => {
                if (switchRole("job_seeker")) navigate(destination);
              }}
            >
              Switch to job seeker & join ↗
            </Button>
          ) : (
            <Button to={destination}>Reserve my seat ↗</Button>
          )}
          {externalUrl(s.meeting_url) && (
            <a
              className="meeting-link"
              href={externalUrl(s.meeting_url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open meeting ↗
            </a>
          )}
          <p className="learning-inline-note">
            Meeting links are shared with the host and joined participants.
          </p>
        </aside>
      </div>
    </div>
  );
}
