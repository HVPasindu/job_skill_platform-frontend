import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Button from "../ui/Button";
import { courseService } from "../../services/courseService";
import { MAX_FILE_BYTES, fileSize } from "../../utils/seekerFiles";
import { externalUrl } from "../../utils/jobFormat";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
const allowed = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];
export default function ResourceDialog({
  materialId,
  resource,
  onClose,
  onSaved,
}) {
  const [mode, setMode] = useState(
    resource?.external_url && !resource.file_url ? "link" : "file",
  );
  const [url, setUrl] = useState(resource?.external_url || "");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [popup, setPopup] = useState(false);
  const input = useRef(null);
  function choose(event) {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length) return;
    const max = resource ? 1 : 5;
    let message =
      picked.length > max
        ? `Choose up to ${max} ${max === 1 ? "file" : "files"}.`
        : "";
    for (const file of picked) {
      if (!allowed.includes(file.type))
        message = "Use PDF, DOC, DOCX, JPG, PNG or WEBP.";
      if (!file.size || file.size > MAX_FILE_BYTES)
        message = `${file.name}: use a non-empty file up to 5 MB.`;
    }
    setError(message);
    setFiles(message ? [] : picked);
  }
  async function submit(event) {
    event.preventDefault();
    if (mode === "file" && !files.length) {
      setError(
        resource ? "Choose one replacement file." : "Choose at least one file.",
      );
      return;
    }
    if (
      mode === "link" &&
      (!externalUrl(url.trim()) || url.trim().length > 255)
    ) {
      setError("Use a full http:// or https:// link, up to 255 characters.");
      return;
    }
    setBusy(true);
    try {
      const payload = new FormData();
      if (mode === "file")
        files.forEach((file) => payload.append("course_files", file));
      else {
        payload.append("external_url", url.trim());
        payload.append("file_type", "link");
      }
      await courseService.saveFile(materialId, payload, resource?.id);
      onClose();
      onSaved();
      await showSuccess(
        resource ? "Resource updated" : "More knowledge, ready to share",
        "Your course resources are saved.",
      );
    } catch (error) {
      setPopup(true);
      await showError(getApiError(error));
      setPopup(false);
    } finally {
      setBusy(false);
    }
  }
  // MUI handles focus/keyboard. Native file input keeps multi-file uploads simple and lightweight.
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      className="seeker-dialog trainer-dialog"
      disableEnforceFocus={popup}
      onClose={busy ? undefined : onClose}
      aria-labelledby="resource-dialog-title"
    >
      <DialogTitle id="resource-dialog-title">
        {resource ? "Replace resource" : "Add files or a link"}
      </DialogTitle>
      <form noValidate onSubmit={submit}>
        <DialogContent>
          <div className="trainer-resource-fields">
            <TextField
              select
              label="Resource format"
              value={mode}
              disabled={busy}
              onChange={(e) => {
                setMode(e.target.value);
                setError("");
              }}
            >
              <MenuItem value="file">
                {resource ? "Replace with a file" : "Upload files"}
              </MenuItem>
              <MenuItem value="link">External link</MenuItem>
            </TextField>
            {mode === "link" ? (
              <TextField
                label="External resource URL"
                value={url}
                disabled={busy}
                onChange={(e) => setUrl(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 255 } }}
                helperText="Use the full link to a video, document or learning resource."
              />
            ) : (
              <>
                <label className={`file-pick-label ${busy ? "disabled" : ""}`}>
                  <span>
                    {resource
                      ? "Choose replacement file"
                      : "Choose resource files"}{" "}
                    ↗
                  </span>
                  <input
                    ref={input}
                    type="file"
                    aria-label={
                      resource
                        ? "Choose replacement file"
                        : "Choose resource files"
                    }
                    multiple={!resource}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    disabled={busy}
                    onChange={choose}
                  />
                </label>
                <p className="form-hint">
                  PDF, DOC, DOCX, JPG, PNG, WEBP · 5 MB each ·{" "}
                  {resource
                    ? "one replacement file"
                    : "up to 5 files per upload"}
                </p>
                {files.length > 0 && (
                  <ul className="trainer-selected-files">
                    {files.map((file, i) => (
                      <li key={i}>
                        {file.name} · {fileSize(file.size)}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy
              ? "Saving resources…"
              : resource
                ? "Replace resource →"
                : "Add resources →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
