import { useCallback } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { courseService } from "../../services/courseService";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
export default function TrainerCourseLayout() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const parent = useOutletContext();
  const load = useCallback(
    (signal) => courseService.course(courseId, signal),
    [courseId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading label="Opening your course…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const course = resource.data;
  if (Number(course.trainer_user_id) !== Number(user.id))
    return <ErrorState message="This course belongs to another trainer." />;
  const base = `/dashboard/trainer/courses/${courseId}`;
  return (
    <>
      <Link className="trainer-back" to="/dashboard/trainer/courses">
        ← My courses
      </Link>
      <div className="trainer-course-context">
        <div>
          <span className="eyebrow">YOUR COURSE / {course.status}</span>
          <h2>{course.title}</h2>
        </div>
        <Link to={`/courses/${courseId}`}>Preview course ↗</Link>
      </div>
      <nav className="trainer-course-tabs" aria-label="Course tools">
        <NavLink to={`${base}/edit`}>Course details</NavLink>
        <NavLink to={`${base}/materials`}>Materials & resources</NavLink>
        <NavLink to={`${base}/students`}>Enrolled students</NavLink>
      </nav>
      <Outlet context={{ ...parent, course, reloadCourse: resource.reload }} />
    </>
  );
}
