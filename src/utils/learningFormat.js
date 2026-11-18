export function progress(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}
export function sessionId(session) {
  return session.mentorship_session_id || session.id;
}
export function canJoin(session) {
  return (
    session.status === "scheduled" &&
    !Number(session.started) &&
    !Number(session.is_joined) &&
    (session.max_participants == null ||
      Number(session.participant_count) < Number(session.max_participants))
  );
}
export function clock(value) {
  return String(value || "").slice(0, 5) || "Not set";
}
export function capacity(session) {
  return session.max_participants == null
    ? `${Number(session.participant_count) || 0} joined · No limit`
    : `${Number(session.participant_count) || 0} / ${session.max_participants} seats`;
}
