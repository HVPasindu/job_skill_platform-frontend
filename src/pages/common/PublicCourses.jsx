import "../../styles-seeker.css";
import "../../styles-trainer.css";
import { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import useApiResource from "../../hooks/useApiResource";
import usePagedResource from "../../hooks/usePagedResource";
import { courseService } from "../../services/courseService";
import TrainerHeader from "../../components/trainer/TrainerHeader";
import CourseCard from "../../components/trainer/CourseCard";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
function Filters({ resource, categories }) {
  const [values, setValues] = useState(
    Object.fromEntries(
      ["search", "category_id", "level", "course_type"].map((k) => [
        k,
        resource.params.get(k) || "",
      ]),
    ),
  );
  const change = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  return (
    <form
      className="course-catalogue-filters"
      onSubmit={(e) => {
        e.preventDefault();
        resource.filter({ ...values, search: values.search.trim() });
      }}
    >
      <TextField
        name="search"
        label="Search courses or trainers"
        value={values.search}
        onChange={change}
        slotProps={{ htmlInput: { maxLength: 150 } }}
      />
      <TextField
        select
        name="category_id"
        label="Course category"
        value={values.category_id}
        onChange={change}
      >
        <MenuItem value="">All categories</MenuItem>
        {categories.map((c) => (
          <MenuItem key={c.id} value={String(c.id)}>
            {c.category_name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        name="level"
        label="Course level"
        value={values.level}
        onChange={change}
      >
        <MenuItem value="">All levels</MenuItem>
        {["beginner", "intermediate", "advanced"].map((l) => (
          <MenuItem key={l} value={l}>
            {l}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        name="course_type"
        label="Course format"
        value={values.course_type}
        onChange={change}
      >
        <MenuItem value="">All formats</MenuItem>
        {["recorded", "live", "hybrid"].map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit">Find my next skill ↗</Button>
      <button
        type="button"
        className="text-action"
        onClick={() => {
          setValues({
            search: "",
            category_id: "",
            level: "",
            course_type: "",
          });
          resource.filter({});
        }}
      >
        Clear filters
      </button>
    </form>
  );
}
export default function PublicCourses() {
  const resource = usePagedResource(courseService.catalogue, 9);
  const categories = useApiResource(courseService.categoryOptions);
  return (
    <div className="page-container section-space course-catalogue">
      <TrainerHeader
        eyebrow="MAKE CURIOSITY YOUR NEXT MOVE"
        title={
          <>
            Know a little more.
            <br />
            <em>Go a lot further.</em>
          </>
        }
        description="Practical courses. People who know their craft. A new possibility waiting to become yours."
      />
      <section aria-label="Course search">
        {categories.loading ? (
          <Loading />
        ) : categories.error ? (
          <ErrorState message={categories.error} onRetry={categories.reload} />
        ) : (
          <Filters
            key={resource.params.toString()}
            resource={resource}
            categories={categories.data}
          />
        )}
      </section>
      <div className="course-results-heading">
        <span className="eyebrow">KNOWLEDGE WORTH STEPPING INTO</span>
        <h2>Find your next possibility.</h2>
      </div>
      {resource.loading ? (
        <Loading label="Finding your next skill…" />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.courses.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Leave room for something new.</h2>
          <p>
            No published courses match this page or these filters. Try a broader
            search.
          </p>
        </section>
      ) : (
        <div className="course-catalogue-grid">
          {resource.data.courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Public course pages"
      />
    </div>
  );
}
