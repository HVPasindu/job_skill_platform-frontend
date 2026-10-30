import "../../styles-seeker.css";
import "../../styles-trainer.css";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { fileUrl } from "../../utils/seekerFiles";
import { words } from "../../utils/jobFormat";
function Outline({ id }) {
  const load = useCallback(
    (params, signal) => courseService.outline(id, params, signal),
    [id],
  );
  const resource = usePagedResource(load);
  return (
    <section className="course-outline">
      <span className="eyebrow">ONE IDEA LEADS TO ANOTHER</span>
      <h2>What the journey looks like.</h2>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.materials.length ? (
        <p>The trainer is preparing the course outline.</p>
      ) : (
        <ol>
          {resource.data.materials.map((material) => (
            <li key={material.id}>
              <span>↗</span>
              <div>
                <h3>{material.title}</h3>
                <p>{words(material.material_type)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Course outline pages"
      />
    </section>
  );
}
export default function CourseDetails() {
  const { courseId } = useParams();
  const { user, activeRole } = useAuth();
  const load = useCallback(
    (signal) => courseService.course(courseId, signal),
    [courseId],
  );
  const resource = useApiResource(load);
  if (resource.loading)
    return (
      <div className="page-container section-space">
        <Loading label="Opening a new possibility…" />
      </div>
    );
  if (resource.error)
    return (
      <div className="page-container section-space">
        <ErrorState message={resource.error} onRetry={resource.reload} />
        <Button to="/courses">Browse courses ↗</Button>
      </div>
    );
  const course = resource.data;
  const owner =
    Number(user?.id) === Number(course.trainer_user_id) &&
    activeRole === "trainer";
  return (
    <div className="page-container section-space course-detail">
      <Link className="trainer-back" to="/courses">
        ← All courses
      </Link>
      <header className="course-detail-hero">
        <div>
          <span className="eyebrow">
            {course.category_name || "YOUR NEXT CHAPTER IN LEARNING"}
          </span>
          {course.status !== "published" && (
            <span className={`course-status status-${course.status}`}>
              Owner preview · {course.status}
            </span>
          )}
          <h1>{course.title}</h1>
          <p>{course.short_description}</p>
          <div className="course-detail-tags">
            {[
              words(course.level),
              words(course.course_type),
              course.duration_text,
            ]
              .filter(Boolean)
              .map((t) => (
                <span key={t}>{t}</span>
              ))}
          </div>
          <p className="course-trainer-byline">
            Shared by <strong>{course.trainer_name}</strong>
          </p>
          {owner && (
            <Button to={`/dashboard/trainer/courses/${course.id}/edit`}>
              Manage this course ↗
            </Button>
          )}
        </div>
        <div className="course-detail-image">
          {fileUrl(course.thumbnail_url) ? (
            <img
              src={fileUrl(course.thumbnail_url)}
              alt={`${course.title} course thumbnail`}
              decoding="async"
            />
          ) : (
            <div className="course-art">
              <span>↗</span>
              <b>
                KNOW MORE.
                <br />
                GO FURTHER.
              </b>
              <i />
            </div>
          )}
        </div>
      </header>
      <div className="course-detail-body">
        <div className="course-detail-content">
          <section className="course-about">
            <span className="eyebrow">A CLOSER LOOK AT WHAT'S NEXT</span>
            <h2>Make room for new knowledge.</h2>
            <p>{course.full_description || course.short_description}</p>
          </section>
          <Outline id={course.id} />
        </div>
        <aside className="course-trainer-panel">
          {fileUrl(course.trainer_image_url) ? (
            <img
              src={fileUrl(course.trainer_image_url)}
              alt={`${course.trainer_name} trainer`}
            />
          ) : (
            <span className="trainer-monogram">
              {course.trainer_name?.charAt(0) || "↗"}
            </span>
          )}
          <span className="eyebrow">MEET YOUR TRAINER</span>
          <h2>{course.trainer_name}</h2>
          {course.specialization && <p>{course.specialization}</p>}
          {course.qualification && <p>{course.qualification}</p>}
          {course.years_of_experience != null &&
            course.years_of_experience !== "" && (
              <p>{course.years_of_experience} years of experience</p>
            )}
          {course.trainer_bio && (
            <p className="trainer-bio">{course.trainer_bio}</p>
          )}
          <Link to="/courses">Explore more possibilities ↗</Link>
        </aside>
      </div>
    </div>
  );
}
