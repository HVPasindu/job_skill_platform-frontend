import { useCallback, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import { materialFields, materialPayload } from "../../data/trainerFields";
import TrainerDialog from "../../components/trainer/TrainerDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { words, externalUrl } from "../../utils/jobFormat";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function CourseMaterials() {
  const { course } = useOutletContext();
  const load = useCallback(
    (params, signal) => courseService.materials(course.id, params, signal),
    [course.id],
  );
  const resource = usePagedResource(load);
  const options = useApiResource(courseService.options);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove(material) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Remove this course material?",
          "Its attached resource records may also be removed under your database's cascade rules.",
          "Remove material",
        ))
      )
        return;
      await courseService.removeMaterial(material.id);
      resource.reload();
      await showSuccess(
        "Material removed",
        "Your course structure is up to date.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">GIVE YOUR KNOWLEDGE A CLEAR PATH</span>
          <h1 className="trainer-section-heading">
            Build the learning journey.
          </h1>
        </div>
        <Button
          disabled={busy || options.loading || !!options.error}
          onClick={() =>
            setEditor({
              material_type: options.data.material_types[0],
              sort_order: "",
            })
          }
        >
          Add material +
        </Button>
      </div>
      <p className="trainer-intro-note">
        Create a material, then open its resources to add files or links.
        Display order controls the course outline.
      </p>
      {options.error && (
        <ErrorState message={options.error} onRetry={options.reload} />
      )}{" "}
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.materials.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Every journey starts somewhere.</h2>
          <p>Add your first material, then attach its resources.</p>
        </section>
      ) : (
        <div className="trainer-material-list">
          {resource.data.materials.map((material) => (
            <article key={material.id}>
              <span className="material-order">
                {material.sort_order ?? "—"}
              </span>
              <div>
                <span className="eyebrow">{words(material.material_type)}</span>
                <h2>{material.title}</h2>
                {externalUrl(material.external_url) && (
                  <a
                    href={externalUrl(material.external_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open material link ↗
                  </a>
                )}
              </div>
              <div className="trainer-material-actions">
                <Link to={String(material.id)}>Files & links ↗</Link>
                <button
                  disabled={busy || !options.data}
                  onClick={() => setEditor(material)}
                >
                  Edit material
                </button>
                <button disabled={busy} onClick={() => remove(material)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Course material pages"
      />
      {editor && options.data && (
        <TrainerDialog
          title={editor.id ? "Edit course material" : "Add course material"}
          fields={materialFields(options.data)}
          record={editor}
          onClose={() => setEditor(null)}
          onSave={(values) =>
            courseService.saveMaterial(
              course.id,
              materialPayload(values),
              editor.id,
            )
          }
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
