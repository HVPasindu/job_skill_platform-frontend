import "../../styles-learning.css";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { learningService } from "../../services/learningService";
import { courseService } from "../../services/courseService";
import { externalUrl, words } from "../../utils/jobFormat";
import { fileUrl } from "../../utils/seekerFiles";
import PageBar from "../../components/employer/PageBar";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function Files({ material }) {
  const load = useCallback(
    (params, signal) => courseService.files(material.id, params, signal),
    [material.id],
  );
  const resource = usePagedResource(load);
  return (
    <>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.files.length ? (
        <p className="learning-copy">
          No attached resources yet. Check the lesson link above, if provided.
        </p>
      ) : (
        <div className="learning-resource-grid">
          {resource.data.files.map((f) => (
            <article key={f.id}>
              <span className="eyebrow">{words(f.file_type)}</span>
              <h2>Resource #{f.id}</h2>
              {fileUrl(f.file_url) || externalUrl(f.external_url) ? (
                <a
                  href={fileUrl(f.file_url) || externalUrl(f.external_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open learning resource ↗
                </a>
              ) : (
                <p>Resource link unavailable.</p>
              )}
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Learning resource pages"
      />
    </>
  );
}
export default function LearningResources() {
  const { enrollmentId, materialId } = useParams();
  const load = useCallback(
    async (signal) => {
      const enrollment = await learningService.enrollment(enrollmentId, signal);
      if (
        !["active", "completed"].includes(enrollment.enrollment_status) ||
        enrollment.course_status === "draft"
      )
        throw new Error("This enrollment cannot access learning materials.");
      const material = await courseService.material(materialId, signal);
      if (Number(material.course_id) !== Number(enrollment.course_id))
        throw new Error("This material belongs to another course.");
      return { enrollment, material };
    },
    [enrollmentId, materialId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const { material } = resource.data;
  return (
    <>
      <Link
        className="learning-back"
        to={`/dashboard/job-seeker/learning/${enrollmentId}`}
      >
        ← Back to my course
      </Link>
      <div className="learning-resource-heading">
        <span className="eyebrow">{words(material.material_type)}</span>
        <h1>{material.title}</h1>
        {externalUrl(material.external_url) && (
          <a
            href={externalUrl(material.external_url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open lesson link ↗
          </a>
        )}
      </div>
      <Files material={material} />
    </>
  );
}
