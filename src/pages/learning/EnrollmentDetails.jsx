import "../../styles-learning.css";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { learningService } from "../../services/learningService";
import { courseService } from "../../services/courseService";
import StatusPill from "../../components/learning/StatusPill";
import ProgressBar from "../../components/learning/ProgressBar";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { words, externalUrl } from "../../utils/jobFormat";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Materials({ courseId, enrollmentId }) {
  const load = useCallback(
    (params, signal) => courseService.materials(courseId, params, signal),
    [courseId],
  );
  const resource = usePagedResource(load);
  return (
    <section className="learning-materials">
      <h2>Your learning path.</h2>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.materials.length ? (
        <p>The trainer is preparing your course materials.</p>
      ) : (
        <div className="learning-material-list">
          {resource.data.materials.map((m) => (
            <article key={m.id}>
              <span>{m.sort_order ?? "↗"}</span>
              <div>
                <small>{words(m.material_type)}</small>
                <h3>{m.title}</h3>
                {externalUrl(m.external_url) && (
                  <a
                    href={externalUrl(m.external_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open lesson link ↗
                  </a>
                )}
              </div>
              <Link
                to={`/dashboard/job-seeker/learning/${enrollmentId}/materials/${m.id}`}
              >
                Resources ↗
              </Link>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Learning material pages"
      />
    </section>
  );
}
export default function EnrollmentDetails() {
  const { enrollmentId } = useParams();
  const [busy, setBusy] = useState(false);
  const load = useCallback(
    (signal) => learningService.enrollment(enrollmentId, signal),
    [enrollmentId],
  );
  const resource = useApiResource(load);
  async function cancel() {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Cancel this enrollment?",
          "You will lose course-material access. Your enrollment record stays in your history, and the same course cannot be enrolled again.",
          "Cancel enrollment",
        ))
      )
        return;
      await learningService.cancel(enrollmentId);
      await showSuccess(
        "Enrollment cancelled",
        "Your enrollment record is retained.",
      );
      resource.reload();
    } catch (error) {
      await showError(getApiError(error));
      resource.reload();
    } finally {
      setBusy(false);
    }
  }
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const e = resource.data;
  const allowed =
    ["active", "completed"].includes(e.enrollment_status) &&
    e.course_status !== "draft";
  return (
    <>
      <Link className="learning-back" to="/dashboard/job-seeker/learning">
        ← My learning
      </Link>
      <section className="learning-detail-hero">
        <div>
          <span className="eyebrow">YOUR NEXT CHAPTER, IN PROGRESS</span>
          <h1>{e.title}</h1>
          <p>{e.short_description}</p>
          <p>Shared by {e.trainer_name}</p>
        </div>
        <div>
          <StatusPill status={e.enrollment_status} />
          <ProgressBar value={e.progress_percentage} />
          {e.enrollment_status === "active" && (
            <Button variant="outlined" disabled={busy} onClick={cancel}>
              Cancel enrollment
            </Button>
          )}
        </div>
      </section>
      {e.enrollment_status === "cancelled" ? (
        <section className="seeker-panel">
          <h2>This chapter is in your history.</h2>
          <p className="learning-copy">
            This enrollment was cancelled. Learning materials are no longer
            available through this enrollment.
          </p>
          <Button to="/courses">Find another course ↗</Button>
        </section>
      ) : !allowed ? (
        <p className="learning-copy">
          The course is currently unavailable for learning.
        </p>
      ) : (
        <>
          <p className="learning-inline-note">
            Your trainer marks completion when the course is finished. The
            progress shown here comes from your enrollment record.
          </p>
          <Materials courseId={e.course_id} enrollmentId={e.id} />
        </>
      )}
    </>
  );
}
