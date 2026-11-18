// Built-in MUI CircularProgress is the loading spinner.
import CircularProgress from "@mui/material/CircularProgress";
export default function Loading({ label = "Loading…" }) {
  return (
    <div className="loading-state" role="status">
      <CircularProgress size={28} />
      <span>{label}</span>
    </div>
  );
}
