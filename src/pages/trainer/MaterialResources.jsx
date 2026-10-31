import DataCollection from "../../components/collections/DataCollection";
import { useCallback, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import ResourceDialog from "../../components/trainer/ResourceDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { fileUrl } from "../../utils/seekerFiles";
import { words, externalUrl } from "../../utils/jobFormat";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Files({ material, course }) {
  const load = useCallback(
    (params, signal) => courseService.files(material.id, params, signal),
    [material.id],
  );
  const resource = usePagedResource(load);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove(file) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Remove this resource?",
          "This removes the resource record and its uploaded file, if present.",
          "Remove resource",
        ))
      )
        return;
      await courseService.removeFile(file.id);
      resource.reload();
      await showSuccess(
        "Resource removed",
        "Your material resources are up to date.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link
        className="trainer-back"
        to={`/dashboard/trainer/courses/${course.id}/materials`}
      >
        ← All course materials
      </Link>
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">{words(material.material_type)}</span>
          <h1 className="trainer-section-heading">{material.title}</h1>
        </div>
        <Button disabled={busy} onClick={() => setEditor({})}>
          Add resources +
        </Button>
      </div>
      {externalUrl(material.external_url) && (
        <p className="trainer-intro-note">
          <a
            href={externalUrl(material.external_url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open material link ↗
          </a>
        </p>
      )}
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.files.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Give the idea something to work with.</h2>
          <p>Attach documents, images or links to this material.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="trainer-resources"
          label="Files and links"
          className="trainer-resource-list"
          defaultView="list"
        >
          {resource.data.files.map((file) => {
            const href =
              fileUrl(file.file_url) || externalUrl(file.external_url);
            return (
              <article key={file.id}>
                <span className="resource-type">{file.file_type}</span>
                <div>
                  <h2>Resource #{file.id}</h2>
                  <p>
                    {file.external_url ||
                      "Uploaded " + words(file.file_type) + " resource"}
                  </p>
                  {href && (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      Open resource ↗
                    </a>
                  )}
                </div>
                <div className="trainer-material-actions">
                  <button disabled={busy} onClick={() => setEditor(file)}>
                    Replace / edit
                  </button>
                  <button disabled={busy} onClick={() => remove(file)}>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Material resource pages"
      />
      {editor && (
        <ResourceDialog
          materialId={material.id}
          resource={editor.id ? editor : null}
          onClose={() => setEditor(null)}
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
export default function MaterialResources() {
  const { materialId } = useParams();
  const { course } = useOutletContext();
  const load = useCallback(
    (signal) => courseService.material(materialId, signal),
    [materialId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  if (Number(resource.data.course_id) !== Number(course.id))
    return <ErrorState message="This material belongs to another course." />;
  return <Files key={materialId} material={resource.data} course={course} />;
}
