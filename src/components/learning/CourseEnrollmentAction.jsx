import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useApiResource from "../../hooks/useApiResource";
import { learningService } from "../../services/learningService";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
function Existing({ courseId }) {
  const load = useCallback(
    (signal) => learningService.forCourse(courseId, signal),
    [courseId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  return resource.data ? (
    <Button to={`/dashboard/job-seeker/learning/${resource.data.id}`}>
      {resource.data.enrollment_status === "cancelled"
        ? "View enrollment record ↗"
        : "Open my learning ↗"}
    </Button>
  ) : (
    <Button to={`/dashboard/job-seeker/courses/${courseId}/enroll`}>
      Enroll in this course ↗
    </Button>
  );
}
export default function CourseEnrollmentAction({ course }) {
  const { user, activeRole, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = `/dashboard/job-seeker/courses/${course.id}/enroll`;
  if (course.status !== "published") return null;
  if (!user)
    return (
      <Link
        className="learning-signin"
        to="/login"
        state={{ from: { pathname: destination } }}
      >
        Sign in to enroll ↗
      </Link>
    );
  if (!user.roles.includes("job_seeker"))
    return (
      <p className="learning-inline-note">
        Enrollment is available through a job seeker account.
      </p>
    );
  if (activeRole !== "job_seeker")
    return (
      <Button
        onClick={() => {
          if (switchRole("job_seeker"))
            navigate(destination, { state: { from: location.pathname } });
        }}
      >
        Switch to job seeker & enroll ↗
      </Button>
    );
  return <Existing courseId={course.id} />;
}
