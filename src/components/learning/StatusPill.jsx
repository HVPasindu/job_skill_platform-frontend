export default function StatusPill({ status }) {
  return <span className={`learning-status status-${status}`}>{status}</span>;
}
