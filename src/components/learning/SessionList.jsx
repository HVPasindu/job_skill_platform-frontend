import DataCollection from "../collections/DataCollection";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { mentorshipService } from "../../services/learningService";
import { clock, capacity, sessionId } from "../../utils/learningFormat";
import { dateLabel, externalUrl } from "../../utils/jobFormat";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import LearningHeader from "./LearningHeader";
import StatusPill from "./StatusPill";
import PageBar from "../employer/PageBar";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
function Filters({ resource, mode }) {
  const [search, setSearch] = useState(resource.params.get("search") || "");
  const [status, setStatus] = useState(resource.params.get("status") || "");
  return (
    <form
      className="learning-filters"
      onSubmit={(e) => {
        e.preventDefault();
        resource.filter({
          status,
          ...(mode === "public" ? { search: search.trim() } : {}),
        });
      }}
    >
      {mode === "public" && (
        <TextField
          label="Search sessions or trainers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 150 } }}
        />
      )}
      <TextField
        select
        label="Session status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        {["scheduled", "completed", "cancelled"].map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit">Filter →</Button>
      <button
        type="button"
        className="text-action"
        onClick={() => {
          setSearch("");
          setStatus("");
          resource.filter({});
        }}
      >
        Clear
      </button>
    </form>
  );
}
const loaders = {
  public: mentorshipService.public,
  trainer: mentorshipService.mine,
  joined: mentorshipService.joined,
};
export default function SessionList({ mode = "public" }) {
  const resource = usePagedResource(loaders[mode], mode === "public" ? 9 : 6);
  const [busy, setBusy] = useState(false);
  async function action(session, remove) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          remove ? "Delete this mentorship session?" : "Leave this session?",
          remove
            ? "The session and its participant records may be removed under your database cascade rules."
            : "Your seat will become available to another learner. You can join again while the session is open and has space.",
          remove ? "Delete session" : "Leave session",
        ))
      )
        return;
      if (remove) await mentorshipService.remove(session.id);
      else await mentorshipService.leave(sessionId(session));
      resource.reload();
      await showSuccess(
        remove ? "Session removed" : "Seat released",
        remove
          ? "Your session list is up to date."
          : "You have left this session.",
      );
    } catch (error) {
      await showError(getApiError(error));
      resource.reload();
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <LearningHeader
        title={
          mode === "trainer" ? (
            <>
              Good conversations.
              <br />
              <em>Start with you.</em>
            </>
          ) : mode === "joined" ? (
            <>
              Your next conversation.
              <br />
              <em>A little closer.</em>
            </>
          ) : (
            <>
              Ask a good question.
              <br />
              <em>Find a new direction.</em>
            </>
          )
        }
        description={
          mode === "trainer"
            ? "Create space for questions, ideas and shared experience."
            : mode === "joined"
              ? "The mentorship sessions you have joined. Keep your next conversation in sight."
              : "Meet someone who has been there. Make room for a conversation that moves you forward."
        }
      />
      <div className="seeker-toolbar">
        <h2>
          {mode === "trainer"
            ? "Your mentorship sessions."
            : mode === "joined"
              ? "My sessions."
              : "Find your next conversation."}
        </h2>
        {mode === "trainer" ? (
          <Button to="/dashboard/trainer/sessions/new">Create session +</Button>
        ) : mode === "joined" ? (
          <Button to="/sessions">Explore sessions ↗</Button>
        ) : null}
      </div>
      {mode !== "joined" && (
        <Filters
          key={resource.params.toString()}
          resource={resource}
          mode={mode}
        />
      )}{" "}
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.sessions.length ? (
        <section className="seeker-empty">
          <h2>A good conversation is ahead.</h2>
          <p>No sessions match this page or filter.</p>
        </section>
      ) : (
        <DataCollection
          viewKey={`sessions-${mode}`}
          label={
            mode === "trainer"
              ? "Your mentorship sessions"
              : mode === "joined"
                ? "Joined sessions"
                : "Mentorship sessions"
          }
          className="session-grid"
        >
          {resource.data.sessions.map((session) => {
            const id = sessionId(session);
            return (
              <article className="session-card" key={id}>
                <div className="session-card-top">
                  <span className="session-date">
                    {dateLabel(session.session_date)}
                  </span>
                  <StatusPill status={session.status} />
                </div>
                <h2>{session.title}</h2>
                <p>
                  {session.description ||
                    "A conversation for your next chapter."}
                </p>
                {session.trainer_name && (
                  <p className="session-trainer">With {session.trainer_name}</p>
                )}
                <div className="session-facts">
                  <span>
                    {clock(session.start_time)}–{clock(session.end_time)}
                  </span>
                  <span>{capacity(session)}</span>
                </div>
                {session.course_title && (
                  <p className="session-course">
                    Course: {session.course_title}
                  </p>
                )}
                <div className="session-card-actions">
                  {mode === "trainer" ? (
                    <>
                      <Link to={`/dashboard/trainer/sessions/${id}/edit`}>
                        Edit session ↗
                      </Link>
                      <Link
                        to={`/dashboard/trainer/sessions/${id}/participants`}
                      >
                        Participants
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => action(session, true)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to={`/sessions/${id}`}>Session details ↗</Link>
                      {mode === "joined" &&
                        session.status === "scheduled" &&
                        !Number(session.started) && (
                          <button
                            disabled={busy}
                            onClick={() => action(session, false)}
                          >
                            Leave session
                          </button>
                        )}
                    </>
                  )}
                  {mode === "joined" &&
                    session.status !== "cancelled" &&
                    externalUrl(session.meeting_url) && (
                      <a
                        href={externalUrl(session.meeting_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open meeting ↗
                      </a>
                    )}
                </div>
              </article>
            );
          })}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Mentorship session pages"
      />
    </>
  );
}
