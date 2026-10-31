import DataCollection from "../collections/DataCollection";
import { useCallback, useState } from "react";
import usePagedResource from "../../hooks/usePagedResource";
import PageBar from "./PageBar";

import { employerService } from "../../services/employerService";
import { asBoolean } from "../../utils/seekerFiles";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import EditorDialog from "./EditorDialog";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
export default function JobSkills({ jobId }) {
  const load = useCallback(
    (params, signal) => employerService.skillsPage(jobId, params, signal),
    [jobId],
  );
  const resource = usePagedResource(load);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove(skill) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Remove this required skill?",
          `${skill.skill_name} will be removed from this job.`,
          "Remove skill",
        ))
      )
        return;
      await employerService.removeSkill(jobId, skill.skill_id);
      resource.reload();
      await showSuccess(
        "Skill removed",
        "Your role requirements have been updated.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  const fields = editor?.skill_id
    ? [{ name: "is_mandatory", label: "Mandatory skill", type: "checkbox" }]
    : [
        { name: "skill_name", label: "Skill name", required: true, max: 100 },
        { name: "is_mandatory", label: "Mandatory skill", type: "checkbox" },
      ];
  return (
    <section className="seeker-panel">
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">WHAT A GREAT FIT LOOKS LIKE</span>
          <h2>Required skills.</h2>
        </div>
        <Button
          onClick={() => setEditor({ is_mandatory: true })}
          disabled={busy}
        >
          Add skill +
        </Button>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.skills.length ? (
        <p>
          No required skills yet. Add skills to help candidates understand the
          role.
        </p>
      ) : (
        <DataCollection
          viewKey="job-skills"
          label="Required skills"
          className="job-skill-list"
          defaultView="list"
        >
          {resource.data.skills.map((skill) => (
            <div key={skill.skill_id}>
              <strong>{skill.skill_name}</strong>
              <span>
                {asBoolean(skill.is_mandatory) ? "Mandatory" : "Nice to have"}
              </span>
              <button disabled={busy} onClick={() => setEditor(skill)}>
                Edit
              </button>
              <button disabled={busy} onClick={() => remove(skill)}>
                Remove
              </button>
            </div>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Required skill pages"
      />
      {editor && (
        <EditorDialog
          title={
            editor.skill_id
              ? `Edit ${editor.skill_name} requirement`
              : "Add required skill"
          }
          fields={fields}
          record={editor}
          onClose={() => setEditor(null)}
          onSave={(values) =>
            employerService.saveSkill(jobId, values, editor.skill_id)
          }
          onSaved={resource.reload}
        />
      )}
    </section>
  );
}
