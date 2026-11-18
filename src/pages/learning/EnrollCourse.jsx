import "../../styles-learning.css";
import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import { courseService } from "../../services/courseService";
import { learningService } from "../../services/learningService";
import LearningHeader from "../../components/learning/LearningHeader";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function EnrollCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const load = useCallback(
    async (signal) => {
      const [course, enrollment] = await Promise.all([
        courseService.course(courseId, signal),
        learningService.forCourse(courseId, signal),
      ]);
      return { course, enrollment };
    },
    [courseId],
  );
  const resource = useApiResource(load);
  async function enroll() {
    setBusy(true);
    try {
      const result = await learningService.enroll(courseId);
      await showSuccess(
        "A new chapter begins",
        "Your course enrollment is ready.",
      );
      navigate(`/dashboard/job-seeker/learning/${result.enrollment_id}`, {
        replace: true,
      });
    } catch (error) {
      await showError(getApiError(error));
      resource.reload();
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <LearningHeader
        title={
          <>
            One decision.
            <br />
            <em>A new direction.</em>
          </>
        }
        description="Make room for learning. Take the next step at your own pace."
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : (
        <section className="seeker-panel">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>{resource.data.course.title}</h2>
          <p className="learning-copy">
            {resource.data.course.short_description}
          </p>
          {resource.data.enrollment ? (
            <>
              <p className="learning-copy">
                You already have an enrollment record for this course.
              </p>
              <Button
                to={`/dashboard/job-seeker/learning/${resource.data.enrollment.id}`}
              >
                View my enrollment ↗
              </Button>
            </>
          ) : resource.data.course.status !== "published" ? (
            <p className="learning-copy">
              This course is not currently accepting enrollments.
            </p>
          ) : (
            <Button onClick={enroll} disabled={busy}>
              {busy ? "Opening your next chapter…" : "Confirm enrollment →"}
            </Button>
          )}
          <p className="learning-inline-note">
            <Link to={`/courses/${courseId}`}>Back to course details ↗</Link>
          </p>
        </section>
      )}
    </>
  );
}
