import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApiResource from "../../hooks/useApiResource";
import { courseService } from "../../services/courseService";
import { courseFields, trainerPayload } from "../../data/trainerFields";
import FormField from "../../components/employer/EmployerField";
import FilePicker from "../../components/seeker/FilePicker";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { fileUrl } from "../../utils/seekerFiles";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
const loadOptions = async (signal) => {
  const [options, categories] = await Promise.all([
    courseService.options(signal),
    courseService.categoryOptions(signal),
  ]);
  return { options, categories };
};
function Form({ course, reloadCourse, options, categories }) {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const fields = courseFields(options, categories);
  const defaults = Object.fromEntries(
    fields.map((f) => [f.name, course?.[f.name] ?? ""]),
  );
  defaults.course_category_id = course?.course_category_id
    ? String(course.course_category_id)
    : "";
  defaults.course_type = course?.course_type || options.course_types[0];
  defaults.status =
    course?.status ||
    (options.statuses.includes("draft") ? "draft" : options.statuses[0]);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });
  async function submit(values) {
    try {
      const result = await courseService.saveCourse(
        trainerPayload(values, image, "thumbnail"),
        course?.id,
      );
      await showSuccess(
        course ? "Course updated" : "A new possibility, started",
        course
          ? "Your course details are saved."
          : "Add your materials next. Publish when you are ready to share.",
      );
      if (course) reloadCourse();
      else
        navigate(`/dashboard/trainer/courses/${result.course_id}/materials`, {
          replace: true,
        });
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <form noValidate className="seeker-panel" onSubmit={handleSubmit(submit)}>
      <div className="course-thumbnail-picker">
        <FilePicker
          image
          label="Choose course thumbnail"
          existingImage={fileUrl(course?.thumbnail_url)}
          disabled={isSubmitting}
          onChange={(files) => setImage(files[0] || null)}
        />
      </div>
      <div className="seeker-form-grid">
        {fields.map((f) => (
          <FormField
            key={f.name}
            definition={f}
            control={control}
            disabled={isSubmitting}
          />
        ))}
      </div>
      <div className="seeker-form-actions">
        <p>
          Draft stays with you. Publish when the course is ready for learners.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving your course…"
            : course
              ? "Save course →"
              : "Create course →"}
        </Button>
      </div>
    </form>
  );
}
export default function CourseEditor() {
  const { course, reloadCourse } = useOutletContext();
  const resource = useApiResource(loadOptions);
  return (
    <>
      <div className="trainer-editor-heading">
        <span className="eyebrow">TURN EXPERIENCE INTO POSSIBILITY</span>
        <h1>{course ? "Shape the next step." : "Start with one good idea."}</h1>
        <p>A clear course gives curiosity somewhere to go.</p>
        <Link to="/dashboard/trainer/categories">
          Manage course categories ↗
        </Link>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : (
        <Form course={course} reloadCourse={reloadCourse} {...resource.data} />
      )}
    </>
  );
}
