import "../../styles-learning.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import useApiResource from "../../hooks/useApiResource";
import { courseService } from "../../services/courseService";
import { mentorshipService } from "../../services/learningService";
import FormField from "../../components/employer/EmployerField";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
const loadCourses = async (signal) =>
  (await courseService.mine({}, signal)).courses;
function Form({ session, reloadSession, courses }) {
  const navigate = useNavigate();
  const fields = [
    {
      name: "title",
      label: "Session title",
      required: true,
      max: 150,
      wide: true,
    },
    {
      name: "course_id",
      label: "Related course (optional)",
      options: courses.map((c) => ({ value: String(c.id), label: c.title })),
    },
    {
      name: "status",
      label: "Session status",
      required: true,
      options: ["scheduled", "completed", "cancelled"],
    },
    {
      name: "session_date",
      label: "Session date",
      type: "date",
      required: true,
    },
    { name: "start_time", label: "Start time", type: "time", required: true },
    { name: "end_time", label: "End time", type: "time", required: true },
    {
      name: "max_participants",
      label: "Maximum participants (blank = unlimited)",
      type: "number",
      min: 1,
      maxNumber: 2147483647,
      step: 1,
    },
    {
      name: "meeting_url",
      label: "Meeting URL",
      type: "url",
      max: 255,
      wide: true,
    },
    {
      name: "description",
      label: "Session description",
      multiline: true,
      rows: 5,
      max: 10000,
      wide: true,
    },
  ];
  const defaults = Object.fromEntries(
    fields.map((f) => [f.name, session?.[f.name] ?? ""]),
  );
  defaults.course_id = session?.course_id ? String(session.course_id) : "";
  defaults.status = session?.status || "scheduled";
  defaults.start_time = session?.start_time?.slice(0, 5) || "10:00";
  defaults.end_time = session?.end_time?.slice(0, 5) || "11:00";
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });
  async function submit(values) {
    if (values.end_time <= values.start_time) {
      setError("end_time", {
        message: "End time must be after start time on the same day.",
      });
      return;
    }
    if (
      values.max_participants !== "" &&
      !Number.isInteger(Number(values.max_participants))
    ) {
      setError("max_participants", { message: "Use a positive whole number." });
      return;
    }
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() || null : v,
      ]),
    );
    try {
      const result = await mentorshipService.save(payload, session?.id);
      await showSuccess(
        session ? "Conversation updated" : "A new conversation, ready",
        "Your mentorship session is saved.",
      );
      if (session) reloadSession();
      else
        navigate(
          `/dashboard/trainer/sessions/${result.session_id}/participants`,
          { replace: true },
        );
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <form className="seeker-panel" noValidate onSubmit={handleSubmit(submit)}>
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
          Times are shown as scheduled. Meeting links are shared with joined
          participants.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving your conversation…"
            : session
              ? "Save session →"
              : "Create session →"}
        </Button>
      </div>
    </form>
  );
}
export default function SessionEditor() {
  const context = useOutletContext();
  const resource = useApiResource(loadCourses);
  return (
    <>
      <div className="trainer-editor-heading">
        <span className="eyebrow">GOOD QUESTIONS NEED A LITTLE SPACE</span>
        <h1>
          {context?.session
            ? "Shape the conversation."
            : "Start a conversation."}
        </h1>
        <p>Bring your experience. Give someone a new perspective.</p>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : (
        <Form
          session={context?.session}
          reloadSession={context?.reloadSession}
          courses={resource.data}
        />
      )}
    </>
  );
}
