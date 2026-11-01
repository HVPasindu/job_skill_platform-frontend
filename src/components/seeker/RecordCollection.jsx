import DataCollection from "../collections/DataCollection";
import { useCallback, useState } from "react";
// MUI Dialog provides focus management; React Hook Form keeps the edit form simple.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import usePagedResource from "../../hooks/usePagedResource";
import PageBar from "../employer/PageBar";
import { seekerService } from "../../services/seekerService";
import { recordSections, readable } from "../../data/seekerFields";
import { asBoolean, dateInput } from "../../utils/seekerFiles";
import { getApiError } from "../../utils/apiError";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
import SeekerField from "./SeekerField";
import SeekerHeader from "./SeekerHeader";
function RecordEditor({ kind, record, onClose, onSaved }) {
  const section = recordSections[kind];
  const [alertOpen, setAlertOpen] = useState(false);
  const defaults = Object.fromEntries(
    section.fields.map((field) => [
      field.name,
      field.type === "checkbox"
        ? asBoolean(record?.[field.name])
        : field.type === "date"
          ? dateInput(record?.[field.name])
          : (record?.[field.name] ?? ""),
    ]),
  );
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });
  const current = useWatch({
    control,
    name: "is_current",
    defaultValue: false,
  });
  const start = useWatch({ control, name: "start_date", defaultValue: "" });
  async function submit(values) {
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    );
    if (kind === "experience" && payload.is_current) payload.end_date = "";
    try {
      await seekerService.saveRecord(kind, payload, record?.id);
      onSaved();
      onClose();
      await showSuccess(
        "A chapter saved",
        `Your ${section.singular} is up to date.`,
      );
    } catch (error) {
      setAlertOpen(true);
      await showError(getApiError(error));
      setAlertOpen(false);
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      className="seeker-dialog"
      disableEnforceFocus={alertOpen}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="record-editor-title"
    >
      <DialogTitle id="record-editor-title">
        {record ? "Edit" : "Add"} {section.singular}
      </DialogTitle>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <div className="seeker-form-grid">
            {section.fields.map((field) => (
              <SeekerField
                key={field.name}
                definition={field}
                control={control}
                disabled={
                  isSubmitting || (field.name === "end_date" && !!current)
                }
                dateRules={{ start, current }}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="text"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default function RecordCollection({ kind }) {
  const section = recordSections[kind];
  const load = useCallback(
    (params, signal) => seekerService.listPage(kind, params, signal),
    [kind],
  );
  const resource = usePagedResource(load);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove(record) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          `Delete this ${section.singular}?`,
          "This removes the record from your profile.",
          "Delete record",
        ))
      )
        return;
      await seekerService.deleteRecord(kind, record.id);
      resource.reload();
      await showSuccess("Record removed", "Your profile has been updated.");
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <SeekerHeader
        eyebrow={`YOUR STORY / ${section.title.toUpperCase()}`}
        title={section.heading}
        description={section.description}
      />
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">YOUR COLLECTION</span>
          <h2>{section.title}</h2>
        </div>
        <Button
          onClick={() => setEditor({})}
          disabled={busy || resource.loading}
        >
          Add {section.singular} +
        </Button>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.items.length ? (
        <section className="seeker-empty">
          <span>✦</span>
          <h2>Your next chapter starts here.</h2>
          <p>
            No {section.title.toLowerCase()} added yet. Add your first record
            above.
          </p>
        </section>
      ) : (
        <DataCollection
          viewKey={`seeker-${kind}`}
          label={section.title}
          className="seeker-record-grid"
        >
          {resource.data.items.map((record, index) => (
            <article
              className={`seeker-record ${kind === "skills" ? "skill-record" : ""}`}
              key={record.id}
            >
              <div className="seeker-record-top">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {section.singular.toUpperCase()}
                </span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>
                {record.qualification || record.job_title || record.skill_name}
              </h3>
              <p className="record-subtitle">
                {record.institute_name ||
                  record.company_name ||
                  readable(record.proficiency_level)}
              </p>
              {kind === "skills" ? (
                <p>
                  {record.years_of_experience == null
                    ? "Experience not specified"
                    : `${record.years_of_experience} ${Number(record.years_of_experience) === 1 ? "year" : "years"} of experience`}
                </p>
              ) : (
                <>
                  <p className="record-dates">
                    {dateInput(record.start_date) || "Start not specified"} —{" "}
                    {asBoolean(record.is_current)
                      ? "Present"
                      : dateInput(record.end_date) || "End not specified"}
                  </p>
                  {record.field_of_study && <p>{record.field_of_study}</p>}
                  {record.grade && <p>Grade: {record.grade}</p>}
                  {record.employment_type && (
                    <span className="seeker-tag">
                      {readable(record.employment_type)}
                    </span>
                  )}
                  {record.description && (
                    <p className="record-description">{record.description}</p>
                  )}
                </>
              )}
              <div className="record-actions">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setEditor(record)}
                >
                  Edit ↗
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(record)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Profile record pages"
      />
      {editor && (
        <RecordEditor
          kind={kind}
          record={editor.id ? editor : null}
          onClose={() => setEditor(null)}
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
