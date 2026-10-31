import DataCollection from "../../components/collections/DataCollection";
import "../../styles-learning.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import usePagedResource from "../../hooks/usePagedResource";
import { learningService } from "../../services/learningService";
import LearningHeader from "../../components/learning/LearningHeader";
import ProgressBar from "../../components/learning/ProgressBar";
import StatusPill from "../../components/learning/StatusPill";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { dateLabel } from "../../utils/jobFormat";
function Filters({ resource }) {
  const [status, setStatus] = useState(resource.params.get("status") || "");
  return (
    <form
      className="learning-filters"
      onSubmit={(e) => {
        e.preventDefault();
        resource.filter({ status });
      }}
    >
      <TextField
        select
        label="Enrollment status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="">All enrollments</MenuItem>
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
          setStatus("");
          resource.filter({});
        }}
      >
        Clear
      </button>
    </form>
  );
}
export default function MyLearning() {
  const resource = usePagedResource(learningService.mine, 6);
  return (
    <>
      <LearningHeader
        title={
          <>
            Keep learning.
            <br />
            <em>Keep moving.</em>
          </>
        }
        description="Your courses, your next steps, and every little bit of progress along the way."
      />
      <div className="seeker-toolbar">
        <h2>My enrollments.</h2>
        <Button to="/courses">Explore courses ↗</Button>
      </div>
      <Filters key={resource.params.toString()} resource={resource} />
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.enrollments.length ? (
        <section className="seeker-empty">
          <h2>A little curiosity goes a long way.</h2>
          <p>No enrollments match this page or status.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="seeker-learning"
          label="Your enrollments"
          className="learning-card-grid"
        >
          {resource.data.enrollments.map((e) => (
            <article className="learning-enrollment-card" key={e.id}>
              <StatusPill status={e.enrollment_status} />
              <h2>{e.title}</h2>
              <p>{e.short_description}</p>
              <small>
                With {e.trainer_name} · Enrolled {dateLabel(e.enrolled_at)}
              </small>
              <ProgressBar value={e.progress_percentage} />
              <Link to={`/dashboard/job-seeker/learning/${e.id}`}>
                {e.enrollment_status === "cancelled"
                  ? "View record ↗"
                  : "Continue learning ↗"}
              </Link>
            </article>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Enrollment pages"
      />
    </>
  );
}
