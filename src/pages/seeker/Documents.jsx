import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
// MUI Dialog and TextField provide accessible upload/edit controls.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
} from "@mui/material";
import SeekerHeader from "../../components/seeker/SeekerHeader";
import FilePicker from "../../components/seeker/FilePicker";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import useApiResource from "../../hooks/useApiResource";
import { seekerService } from "../../services/seekerService";
import { fileSize, fileUrl, asBoolean } from "../../utils/seekerFiles";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
const types = [
  ["cv", "CV / Resume"],
  ["certificate", "Certificate"],
  ["other", "Other document"],
];
function DocumentEditor({ document, onClose, onSaved }) {
  const [type, setType] = useState(document?.document_type || "cv");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  async function save(event) {
    event.preventDefault();
    if (!document && !files.length) {
      setAlertOpen(true);
      await showError("Choose at least one document to upload.");
      setAlertOpen(false);
      return;
    }
    setBusy(true);
    try {
      const payload = new FormData();
      payload.append("document_type", type);
      files.forEach((file) =>
        payload.append(document ? "resume" : "resumes", file),
      );
      if (document) await seekerService.updateDocument(document.id, payload);
      else await seekerService.uploadDocuments(payload);
      onSaved();
      onClose();
      await showSuccess(
        document ? "Document updated" : "Documents uploaded",
        document && files.length
          ? "Run resume analysis again for the replacement file."
          : "Your documents are ready in your collection.",
      );
    } catch (error) {
      setAlertOpen(true);
      await showError(getApiError(error));
      setAlertOpen(false);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      className="seeker-dialog"
      disableEnforceFocus={alertOpen}
      onClose={busy ? undefined : onClose}
      aria-labelledby="document-editor-title"
    >
      <DialogTitle id="document-editor-title">
        {document ? "Edit document" : "Upload documents"}
      </DialogTitle>
      <form onSubmit={save}>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Document type"
            value={type}
            disabled={busy}
            onChange={(event) => setType(event.target.value)}
          >
            {types.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <FilePicker
            multiple={!document}
            label={document ? "Choose replacement file" : "Choose documents"}
            onChange={setFiles}
            disabled={busy}
          />
          <p className="form-hint">
            {document
              ? "Leave the file selection empty to change only its type. Replacing a file clears its old saved AI analysis."
              : "All selected files use the document type above. Upload certificates separately from your CV."}
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy
              ? "Saving documents…"
              : document
                ? "Save document →"
                : "Upload documents →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default function Documents() {
  const load = useCallback(
    (signal) => seekerService.list("resumes", signal),
    [],
  );
  const resource = useApiResource(load);
  const [editor, setEditor] = useState(null);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  async function action(document, remove = false) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          remove ? "Delete this document?" : "Make this your primary document?",
          remove
            ? "This removes the uploaded file and its associated records. Existing application links may also be affected."
            : "Only one document can be primary. This replaces your current primary selection.",
          remove ? "Delete document" : "Make primary",
        ))
      )
        return;
      if (remove) await seekerService.deleteRecord("resumes", document.id);
      else await seekerService.primaryDocument(document.id);
      resource.reload();
      await showSuccess(
        remove ? "Document removed" : "Primary document updated",
        "Your collection is up to date.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  const documents = (resource.data || []).filter(
    (doc) => filter === "all" || doc.document_type === filter,
  );
  return (
    <>
      <SeekerHeader
        eyebrow="02 / THE PROOF BEHIND YOUR POTENTIAL"
        title={
          <>
            Your story.
            <br />
            On record.
          </>
        }
        description="CVs, certificates and the documents that back your next move."
      />
      <div className="seeker-toolbar">
        <TextField
          select
          label="Filter documents"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          size="small"
        >
          <MenuItem value="all">All documents</MenuItem>
          {types.map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          disabled={busy || resource.loading}
          onClick={() => setEditor({})}
        >
          Upload documents +
        </Button>
      </div>
      <p className="seeker-inline-note">
        Keep one primary document.{" "}
        <Link to="/dashboard/job-seeker/resume-insights">
          Explore resume insights ↗
        </Link>
      </p>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !documents.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Make your potential tangible.</h2>
          <p>
            No documents in this collection yet. Add a CV or certificate to get
            started.
          </p>
        </section>
      ) : (
        <div className="seeker-document-grid">
          {documents.map((doc) => (
            <article className="document-card" key={doc.id}>
              <div className={`document-cover type-${doc.document_type}`}>
                <span>
                  {doc.file_type?.includes("image")
                    ? "IMAGE"
                    : doc.file_type?.includes("word")
                      ? "WORD"
                      : "PDF"}
                </span>
                <strong>
                  {doc.document_type === "cv"
                    ? "Your next\nchapter."
                    : doc.document_type === "certificate"
                      ? "Earned.\nRecorded."
                      : "A little\nmore you."}
                </strong>
                <span className="document-cover-arrow">↗</span>
              </div>
              <div className="document-details">
                <div className="document-badges">
                  <span>
                    {types.find(([type]) => type === doc.document_type)?.[1] ||
                      "Other"}
                  </span>
                  {asBoolean(doc.is_primary) && (
                    <span className="primary-badge">✦ Primary</span>
                  )}
                </div>
                <h3>{doc.file_name}</h3>
                <p>{fileSize(doc.file_size)}</p>
                <div className="document-actions">
                  {fileUrl(doc.file_url) && (
                    <a
                      href={fileUrl(doc.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open file ↗
                    </a>
                  )}
                  <button disabled={busy} onClick={() => setEditor(doc)}>
                    Edit / replace
                  </button>
                  {!asBoolean(doc.is_primary) && (
                    <button disabled={busy} onClick={() => action(doc)}>
                      Make primary
                    </button>
                  )}
                  <button disabled={busy} onClick={() => action(doc, true)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {editor && (
        <DocumentEditor
          document={editor.id ? editor : null}
          onClose={() => setEditor(null)}
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
