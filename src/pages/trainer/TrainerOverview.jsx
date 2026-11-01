import DataCollection from "../../components/collections/DataCollection";
import "../../styles-seeker.css";
import "../../styles-trainer.css";
import { Link } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import useAuth from "../../hooks/useAuth";
import { courseService } from "../../services/courseService";
import KnowledgeSculpture from "../../components/experience/KnowledgeSculpture";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function TrainerOverview() {
  const { user } = useAuth();
  const resource = useApiResource(courseService.dashboard);
  if (resource.loading)
    return <Loading label="Finding your next possibility…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const { profile, counts, recent_courses } = resource.data;
  return (
    <>
      <p className="trainer-greeting">
        Hello, {user.full_name || "there"}. Good knowledge goes further.
      </p>
      <section className="trainer-overview-hero">
        <div>
          <span className="eyebrow">YOUR TRAINER STUDIO</span>
          <h1>
            Pass it on.
            <br />
            <em>Watch it grow.</em>
          </h1>
          <p>
            Turn what you know into someone else's next big step. Your courses,
            materials and ideas, all in one place.
          </p>
          <Button
            to={
              profile
                ? "/dashboard/trainer/courses/new"
                : "/dashboard/trainer/profile"
            }
          >
            {profile ? "Create a course ↗" : "Create trainer profile ↗"}
          </Button>
        </div>
        <KnowledgeSculpture />
      </section>
      <div className="trainer-step7-links">
        <Link to="/dashboard/trainer/students">Meet your learners ↗</Link>
        <Link to="/dashboard/trainer/sessions">Manage mentorship ↗</Link>
      </div>
      <div className="trainer-metrics">
        {[
          ["Your courses", counts.courses, "courses"],
          ["Published", counts.published, "courses?status=published"],
          ["Course materials", counts.materials, "materials"],
          ["Attached resources", counts.resources, "materials"],
        ].map(([label, count, path]) => (
          <Link key={label} to={`/dashboard/trainer/${path}`}>
            <span>{label}</span>
            <strong>{Number(count) || 0}</strong>
            <small>Explore ↗</small>
          </Link>
        ))}
      </div>
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">A LITTLE MOMENTUM</span>
          <h2>Your latest ideas.</h2>
        </div>
        <Link to="/dashboard/trainer/courses">All courses ↗</Link>
      </div>
      {!profile ? (
        <section className="trainer-onboarding">
          <h2>Let learners meet you.</h2>
          <p>Create your trainer profile before building your first course.</p>
          <Button to="/dashboard/trainer/profile">Introduce myself ↗</Button>
        </section>
      ) : !recent_courses.length ? (
        <section className="trainer-onboarding">
          <p>No courses yet. One good idea is all it takes to start.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="trainer-recent"
          label="Recent courses"
          className="trainer-recent"
          defaultView="list"
        >
          {recent_courses.map((course) => (
            <Link
              key={course.id}
              to={`/dashboard/trainer/courses/${course.id}/edit`}
            >
              <h3>{course.title}</h3>
              <span className={`course-status status-${course.status}`}>
                {course.status}
              </span>
              <b>↗</b>
            </Link>
          ))}
        </DataCollection>
      )}
    </>
  );
}
