// Built-in MUI Chip labels session status; no sample session data is created.
import { Chip } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import usePagedResource from "../../hooks/usePagedResource";
import PageBar from "../../components/employer/PageBar";
import api from "../../api/axiosInstance";
const loadSessions = async (params, signal) =>
  (await api.get("/mentorship-sessions", { params, signal })).data;
export default function PublicSessions() {
  const resource = usePagedResource(loadSessions, 9);
  const { loading, error, reload: retry } = resource;
  const sessions = resource.data?.sessions || [];
  return (
    <div className="page-container section-space">
      <PageHeader
        eyebrow="A NEW PERSPECTIVE STARTS HERE"
        title={
          <>
            Good questions.
            <br />
            Great connections.
          </>
        }
        description="Explore mentorship sessions and connect with a new perspective on your career."
      />
      {loading ? (
        <Loading label="Loading mentorship sessions…" />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="Room for a new perspective."
          description="There are no mentorship sessions to show right now."
        />
      ) : (
        <div className="listing-grid">
          {sessions.map((session) => (
            <Card className="listing-card" key={session.id}>
              <div className="listing-icon">
                <ForumOutlinedIcon />
              </div>
              <span className="eyebrow">
                {session.trainer_name || "Mentorship"}
              </span>
              <h2>{session.title}</h2>
              <p>
                {session.description ||
                  "Connect, learn, and grow with a mentor."}
              </p>
              <Chip size="small" label={session.status} />
            </Card>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Mentorship session pages"
      />
    </div>
  );
}
