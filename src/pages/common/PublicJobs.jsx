// Built-in MUI Chip labels job metadata. The data-loading logic stays in usePublicData.
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import { Chip } from "@mui/material";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import usePublicData from "../../hooks/usePublicData";
import { getPublicJobs } from "../../services/publicService";

export default function PublicJobs() {
  const { data: jobs, loading, error, retry } = usePublicData(getPublicJobs);
  return (
    <div className="page-container section-space">
      <PageHeader
        eyebrow="MAKE YOUR NEXT MOVE"
        title={
          <>
            Work with purpose.
            <br />
            Grow with possibility.
          </>
        }
        description="Explore current opportunities from companies on SkillJob. Find a direction that feels right for you."
      />
      {loading ? (
        <Loading label="Finding opportunities…" />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="Your next opportunity is on its way."
          description="There are no open jobs to show right now. Check back soon."
        />
      ) : (
        <div className="listing-grid">
          {jobs.map((job) => (
            <Card className="listing-card" key={job.id}>
              <div className="listing-icon">
                <WorkOutlineIcon />
              </div>
              <span className="eyebrow">{job.company_name}</span>
              <h2>{job.title}</h2>
              <p>{job.location || "Location not specified"}</p>
              <div className="flex flex-wrap gap-2">
                <Chip
                  label={
                    job.work_mode?.replaceAll("_", " ") ||
                    "Work mode not specified"
                  }
                  size="small"
                />
                <Chip
                  label={
                    job.job_type?.replaceAll("_", " ") ||
                    "Job type not specified"
                  }
                  size="small"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
