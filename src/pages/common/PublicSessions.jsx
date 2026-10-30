// Built-in MUI Chip labels session status; no sample session data is created.
import { Chip } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import usePublicData from "../../hooks/usePublicData";
import { getPublicSessions } from "../../services/publicService";
export default function PublicSessions() {
  const {
    data: sessions,
    loading,
    error,
    retry,
  } = usePublicData(getPublicSessions);
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
    </div>
  );
}
