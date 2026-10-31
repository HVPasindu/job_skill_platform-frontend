import { useState } from "react";
// MUI supplies filters and the read-only detail dialog; server pagination provides totals.
import {
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { supportService } from "../../services/supportService";
import AdminHeader from "../../components/admin/AdminHeader";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function timestamp(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}
function Filters({ resource }) {
  const [search, setSearch] = useState(resource.params.get("search") || "");
  const [type, setType] = useState(resource.params.get("user_type") || "");
  return (
    <form
      className="admin-filters"
      onSubmit={(event) => {
        event.preventDefault();
        resource.filter({ search: search.trim(), user_type: type });
      }}
    >
      <TextField
        label="Search questions, replies or names"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      <TextField
        label="Account link"
        select
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <MenuItem value="">All messages</MenuItem>
        <MenuItem value="linked">Linked account</MenuItem>
        <MenuItem value="unlinked">No linked account</MenuItem>
      </TextField>
      <Button type="submit">Search →</Button>
      <button
        type="button"
        className="admin-clear"
        onClick={() => {
          setSearch("");
          setType("");
          resource.filter({});
        }}
      >
        Clear
      </button>
    </form>
  );
}
export default function ChatbotLogs() {
  const resource = usePagedResource(supportService.logs);
  const [selected, setSelected] = useState(null);
  return (
    <>
      <AdminHeader
        title={
          <>
            Every question.
            <br />
            <em>A little insight.</em>
          </>
        }
        description="Review saved platform questions and replies, including guest and signed-in requests."
      />
      <div className="admin-toolbar">
        <div>
          <span className="eyebrow">LISTEN. UNDERSTAND. HELP.</span>
          <h2>Chatbot logs.</h2>
        </div>
        <Button
          variant="outlined"
          onClick={resource.reload}
          disabled={resource.loading}
        >
          Refresh ↻
        </Button>
      </div>
      <p className="admin-support-note">
        Only administrators can read these logs. “No linked account” includes
        guest messages and records whose account was removed.
      </p>
      <Filters key={resource.params.toString()} resource={resource} />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.logs.length ? (
        <section className="admin-empty">
          <h2>No questions on this page.</h2>
          <p>
            Try another filter, or open the assistant and ask a platform
            question.
          </p>
        </section>
      ) : (
        <div className="admin-log-list">
          {resource.data.logs.map((log) => (
            <article key={log.id} className="admin-log-card">
              <div className="admin-log-meta">
                <span>
                  {log.user_id
                    ? log.full_name || "Linked account"
                    : "No linked account"}
                </span>
                <time>{timestamp(log.created_at)}</time>
                <small>#{log.id}</small>
              </div>
              <h3>{log.question}</h3>
              <p>{log.response}</p>
              <Button variant="text" onClick={() => setSelected(log)}>
                Read full exchange ↗
              </Button>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Chatbot log pages"
      />
      {selected && (
        <Dialog
          open
          fullWidth
          maxWidth="md"
          className="admin-dialog"
          onClose={() => setSelected(null)}
          aria-labelledby="log-dialog-title"
        >
          <DialogTitle id="log-dialog-title">
            Support exchange #{selected.id}
          </DialogTitle>
          <DialogContent>
            <div className="admin-log-detail">
              <small>
                {selected.full_name || "No linked account"} ·{" "}
                {timestamp(selected.created_at)}
              </small>
              <h3>Question</h3>
              <p>{selected.question}</p>
              <h3>Assistant reply</h3>
              <p>{selected.response}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
