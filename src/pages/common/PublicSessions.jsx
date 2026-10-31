import "../../styles-seeker.css";
import "../../styles-learning.css";
import SessionList from "../../components/learning/SessionList";
export default function PublicSessions() {
  return (
    <div className="page-container section-space">
      <SessionList />
    </div>
  );
}
