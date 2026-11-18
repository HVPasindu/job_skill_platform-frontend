import DataCollection from "../../components/collections/DataCollection";
import { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import TrainerHeader from "../../components/trainer/TrainerHeader";
import CourseCard from "../../components/trainer/CourseCard";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
function Filters({ resource }) {
  const [search, setSearch] = useState(resource.params.get("search") || "");
  const [status, setStatus] = useState(resource.params.get("status") || "");
  return (
    <form
      className="trainer-filters"
      onSubmit={(e) => {
        e.preventDefault();
        resource.filter({ search: search.trim(), status });
      }}
    >
      <TextField
        label="Search your courses"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ htmlInput: { maxLength: 150 } }}
      />
      <TextField
        select
        label="Course status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="">All statuses</MenuItem>
        {["draft", "published", "archived"].map((s) => (
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
export default function MyCourses({ materials = false }) {
  const resource = usePagedResource(courseService.mine, 6);
  const [busy, setBusy] = useState(false);
  async function remove(course) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Delete this course permanently?",
          "This can remove its materials, resource records and enrollments under your database's cascade rules. Archive it instead to retain its records.",
          "Delete course",
        ))
      )
        return;
      await courseService.removeCourse(course.id);
      resource.reload();
      await showSuccess("Course removed", "Your course list is up to date.");
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <TrainerHeader
        title={
          materials ? (
            <>
              Knowledge, organised.
              <br />
              <em>Ready to share.</em>
            </>
          ) : (
            <>
              What you know.
              <br />
              <em>Where they go next.</em>
            </>
          )
        }
        description={
          materials
            ? "Choose a course to organise its materials, files and links."
            : "Make something worth learning. Shape your courses, one good idea at a time."
        }
      />
      <div className="seeker-toolbar">
        <h2>{materials ? "Choose a course." : "Your courses."}</h2>
        <Button to="/dashboard/trainer/courses/new">Create course +</Button>
      </div>
      <Filters key={resource.params.toString()} resource={resource} />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.courses.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Your next idea belongs here.</h2>
          <p>No courses match this page or these filters.</p>
        </section>
      ) : (
        <DataCollection
          viewKey={materials ? "trainer-material-picker" : "trainer-courses"}
          label={materials ? "Choose a course" : "Your courses"}
          className="trainer-course-grid"
        >
          {resource.data.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              manage
              materials={materials}
              onDelete={remove}
              busy={busy}
            />
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Your course pages"
      />
    </>
  );
}
