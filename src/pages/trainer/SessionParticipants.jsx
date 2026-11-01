import DataCollection from "../../components/collections/DataCollection";
import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import usePagedResource from "../../hooks/usePagedResource";
import { mentorshipService } from "../../services/learningService";
import { capacity } from "../../utils/learningFormat";
import { dateLabel } from "../../utils/jobFormat";
import PageBar from "../../components/employer/PageBar";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function SessionParticipants() {
  const { session } = useOutletContext();
  const load = useCallback(
    (params, signal) =>
      mentorshipService.participants(session.id, params, signal),
    [session.id],
  );
  const resource = usePagedResource(load);
  return (
    <>
      <div className="trainer-editor-heading">
        <span className="eyebrow">THE PEOPLE IN THE CONVERSATION</span>
        <h1>Your participants.</h1>
        <p>
          {capacity({
            ...session,
            participant_count:
              resource.data?.pagination?.total ?? session.participant_count,
          })}
        </p>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.participants.length ? (
        <section className="seeker-empty">
          <h2>Leave room for a good question.</h2>
          <p>No participants yet.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="session-participants"
          label="Session participants"
          className="participant-list"
          defaultView="list"
        >
          {resource.data.participants.map((p) => (
            <article key={p.id}>
              <span>{p.full_name.charAt(0)}</span>
              <div>
                <h2>{p.full_name}</h2>
                <p>{p.email}</p>
                <small>Joined {dateLabel(p.joined_at)}</small>
              </div>
            </article>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Participant pages"
      />
    </>
  );
}
