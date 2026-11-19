import ExpandableRecord, {
  RecordToggle,
} from "../collections/ExpandableRecord";
import ImageWithFallback from "../ui/ImageWithFallback";
import { Link } from "react-router-dom";
import { fileUrl } from "../../utils/seekerFiles";
import { words } from "../../utils/jobFormat";
export default function CourseCard({
  course,
  manage = false,
  materials = false,
  onDelete,
  busy,
}) {
  const to = manage
    ? `/dashboard/trainer/courses/${course.id}/${materials ? "materials" : "edit"}`
    : `/courses/${course.id}`;
  return (
    <article className="course-card">
      <Link
        to={to}
        tabIndex={-1}
        aria-hidden="true"
        className="course-card-image"
      >
        <ImageWithFallback
          src={fileUrl(course.thumbnail_url)}
          alt=""
          fallback={
            <div className="course-art">
              <span>↗</span>
              <b>{words(course.course_type) || "Learning"}</b>
              <i />
            </div>
          }
        />
      </Link>
      <ExpandableRecord as="div" className="course-card-body">
        <div className="course-card-meta">
          <span data-preview-text>
            {course.category_name || words(course.course_type) || "Course"}
          </span>
          {manage && (
            <span className={`course-status status-${course.status}`}>
              {course.status}
            </span>
          )}
        </div>
        <h2 data-preview-text>
          <Link to={to}>{course.title}</Link>
        </h2>
        <p data-preview-text>{course.short_description}</p>
        <RecordToggle />
        <div className="course-card-foot">
          <span data-preview-text>
            {[words(course.level), course.duration_text]
              .filter(Boolean)
              .join(" · ") || "Explore the course"}
          </span>
          {course.trainer_name && (
            <span data-preview-text>By {course.trainer_name}</span>
          )}
        </div>
        <div className="course-card-actions">
          <Link to={to}>
            {manage
              ? materials
                ? "Open materials ↗"
                : "Edit course ↗"
              : "Explore course ↗"}
          </Link>
          {manage && !materials && (
            <>
              <Link to={`/dashboard/trainer/courses/${course.id}/materials`}>
                Materials
              </Link>
              <button onClick={() => onDelete(course)} disabled={busy}>
                Delete
              </button>
            </>
          )}
        </div>
      </ExpandableRecord>
    </article>
  );
}
