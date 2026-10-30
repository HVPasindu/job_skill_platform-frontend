import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import SeekerHeader from "../../components/seeker/SeekerHeader";
import ParseResult from "../../components/seeker/ParseResult";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import useApiResource from "../../hooks/useApiResource";
import { seekerService } from "../../services/seekerService";
import { canParse } from "../../utils/seekerFiles";
import { normalizeParseResult } from "../../utils/parseResult";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Analysis({ documents }) {
  const [selected, setSelected] = useState("latest");
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState(null);
  const load = useCallback(
    (signal) =>
      seekerService.parseResult(
        selected === "latest" ? null : selected,
        signal,
      ),
    [selected],
  );
  const saved = useApiResource(load);
  const chosen = documents.find((doc) => String(doc.id) === selected);
  const result = normalizeParseResult(fresh || saved.data);
  async function parse() {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Analyse your document with AI?",
          "Your document text will be sent to OpenRouter for AI processing. Review your document before continuing. Your profile will not be changed.",
          selected === "latest" ? "Run auto analysis" : "Analyse selected file",
        ))
      )
        return;
      const response = await seekerService.parse(
        selected === "latest" ? null : selected,
      );
      const source = documents.find(
        (doc) => String(doc.id) === String(response.resume_id),
      );
      setFresh({ ...response, file_name: source?.file_name });
      saved.reload();
      await showSuccess(
        "A new perspective is ready",
        "Review the extracted skills, experience and education below.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  function choose(event) {
    setFresh(null);
    setSelected(event.target.value);
  }
  return (
    <>
      <section className="seeker-panel analysis-controls">
        <span className="eyebrow">LET YOUR EXPERIENCE SPEAK</span>
        <h2>
          Find the details
          <br />
          in your story.
        </h2>
        <p>
          Auto mode analyses your newest CV. If you have no CV, it uses your
          supported primary documents. Select a file below to analyse a specific
          document.
        </p>
        <TextField
          select
          fullWidth
          label="Analysis source"
          value={selected}
          disabled={busy}
          onChange={choose}
        >
          <MenuItem value="latest">Automatic / latest saved result</MenuItem>
          {documents.map((doc) => (
            <MenuItem key={doc.id} value={String(doc.id)}>
              {doc.file_name} · {doc.document_type}
              {canParse(doc) ? "" : " · upload only (DOC)"}
            </MenuItem>
          ))}
        </TextField>
        <div className="analysis-actions">
          <Button
            disabled={busy || saved.loading || (chosen && !canParse(chosen))}
            onClick={parse}
          >
            {busy
              ? "Reading your story…"
              : selected === "latest"
                ? "Run auto analysis ✦"
                : "Analyse selected file ✦"}
          </Button>
          <button
            type="button"
            className="text-action"
            disabled={busy}
            onClick={() => {
              setFresh(null);
              saved.reload();
            }}
          >
            Refresh saved result
          </button>
        </div>
        {chosen && !canParse(chosen) && (
          <p className="field-error">
            This file cannot be parsed. Upload PDF, DOCX, JPG or PNG instead.
          </p>
        )}
        <p className="form-hint">
          PDFs must contain readable text; JPG/PNG use English OCR. AI
          suggestions can be inaccurate. Analysis can take a few minutes.
        </p>
      </section>
      {busy && (
        <p className="analysis-busy" role="status">
          ✦ Analysing your document. Please keep this page open…
        </p>
      )}
      {saved.loading && !fresh ? (
        <Loading label="Checking saved insights…" />
      ) : saved.error ? (
        <ErrorState message={saved.error} onRetry={saved.reload} />
      ) : result ? (
        <ParseResult result={result} />
      ) : (
        <section className="seeker-empty">
          <span>✦</span>
          <h2>Your story has more to say.</h2>
          <p>
            No saved analysis for this source. Run an analysis to discover its
            details.
          </p>
        </section>
      )}
    </>
  );
}
export default function ResumeInsights() {
  const load = useCallback(
    (signal) => seekerService.list("resumes", signal),
    [],
  );
  const resource = useApiResource(load);
  return (
    <>
      <SeekerHeader
        eyebrow="03 / A LITTLE INTELLIGENCE. A LOT OF POSSIBILITY."
        title={
          <>
            Meet your
            <br />
            <em>potential.</em>
          </>
        }
        description="Turn the details in your documents into a clearer view of your experience."
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.length ? (
        <section className="seeker-empty">
          <span>✦</span>
          <h2>Start with your story.</h2>
          <p>Upload a CV or document before running resume analysis.</p>
          <Button to="/dashboard/job-seeker/documents">
            Upload my first document ↗
          </Button>
        </section>
      ) : (
        <Analysis documents={resource.data} />
      )}
      <p className="seeker-inline-note">
        <Link to="/dashboard/job-seeker/documents">← Manage documents</Link>
      </p>
    </>
  );
}
