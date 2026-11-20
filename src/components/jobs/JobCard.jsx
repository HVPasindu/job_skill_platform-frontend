import ExpandableRecord, {
  RecordToggle,
} from "../collections/ExpandableRecord";
import { Link } from "react-router-dom";
import { salary, words } from "../../utils/jobFormat";
export default function JobCard({ job }) {
  return (
    <ExpandableRecord className="job-card">
      <div className="job-card-top">
        <span className="job-company-mark">
          {(job.company_name || "S").charAt(0).toUpperCase()}
        </span>
        <span data-preview-text className="job-category">
          {job.category_name || "Opportunity"}
        </span>
        <span aria-hidden="true">↗</span>
      </div>
      <p data-preview-text className="job-company-name">
        {job.company_name}
      </p>
      <h2 data-preview-text>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h2>
      <p data-preview-text className="job-card-location">
        {job.location || "Location not specified"}
      </p>
      <RecordToggle />
      <div className="job-tags">
        <span>{words(job.work_mode)}</span>
        <span>{words(job.job_type)}</span>
        {job.experience_level && <span>{words(job.experience_level)}</span>}
      </div>
      <div className="job-card-bottom">
        <strong>{salary(job)}</strong>
        <Link aria-label={`View ${job.title}`} to={`/jobs/${job.id}`}>
          View role ↗
        </Link>
      </div>
    </ExpandableRecord>
  );
}
