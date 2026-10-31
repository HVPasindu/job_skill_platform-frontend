import "../../styles-learning.css";
import { useCallback, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { learningService } from "../../services/learningService";
import LearningHeader from "../../components/learning/LearningHeader";
import StatusPill from "../../components/learning/StatusPill";
import ProgressBar from "../../components/learning/ProgressBar";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Filters({ resource, scoped }) {
  const [search, setSearch] = useState(resource.params.get("search") || "");
  const [status, setStatus] = useState(resource.params.get("status") || "");
  return (
    <form
      className="learning-filters"
      onSubmit={(e) => {
        e.preventDefault();
        resource.filter({
          status,
          ...(!scoped ? { search: search.trim() } : {}),
        });
      }}
    >
      {!scoped && (
        <TextField
          label="Search students or courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 150 } }}
        />
      )}
      <TextField
        select
        label="Student enrollment status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        {["active", "completed", "cancelled"].map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit">Filter →</Button>
      <button
        type="button"
        className="text-action"
        onClick={() => {
          setSearch("");
          setStatus("");
          resource.filter({});
        }}
      >
        Clear
      </button>
    </form>
  );
}
export default function Students() {
  const { courseId } = useParams();
  const { course } = useOutletContext();
  const load = useCallback(
    (params, signal) =>
      courseId
        ? learningService.courseStudents(courseId, params, signal)
        : learningService.students(params, signal),
    [courseId],
  );
  const resource = usePagedResource(load);
  const [busy, setBusy] = useState(false);
  async function complete(e) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Mark this enrollment completed?",
          `${e.full_name} will see completed status and 100% course progress.`,
          "Mark completed",
        ))
      )
        return;
      await learningService.complete(e.id);
      resource.reload();
      await showSuccess(
        "A chapter completed",
        "The learner can see their updated enrollment.",
      );
    } catch (error) {
      await showError(getApiError(error));
      resource.reload();
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {course ? (
        <div className="trainer-editor-heading">
          <h1>Your learners.</h1>
          <p>{course.title}</p>
        </div>
      ) : (
        <LearningHeader
          title={
            <>
              Good teaching.
              <br />
              <em>Real progress.</em>
            </>
          }
          description="The people learning with you. Follow their enrollments and recognise a completed chapter."
        />
      )}
      <Filters
        key={resource.params.toString()}
        resource={resource}
        scoped={!!courseId}
      />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.enrollments.length ? (
        <section className="seeker-empty">
          <h2>New connections are ahead.</h2>
          <p>No student enrollments match this page or filter.</p>
        </section>
      ) : (
        <div className="student-list">
          {resource.data.enrollments.map((e) => (
            <article key={e.id}>
              <div>
                <h2>{e.full_name}</h2>
                <p>{e.email}</p>
                <p>{course?.title || e.course_title}</p>
                <StatusPill status={e.enrollment_status} />
              </div>
              <ProgressBar value={e.progress_percentage} />
              {e.enrollment_status === "active" && (
                <Button disabled={busy} onClick={() => complete(e)}>
                  Mark completed ↗
                </Button>
              )}
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Student pages"
      />
    </>
  );
}
