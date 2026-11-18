import AdminHeader from "../../components/admin/AdminHeader";
import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
import TiltCard from "../../components/experience/TiltCard";
export default function AdminOverview() {
  return (
    <>
      <AdminHeader
        title={
          <>
            Small details.
            <br />
            <em>Better connections.</em>
          </>
        }
        description="Keep job categories useful and help people find their next step through a clearer support experience."
      />
      <div className="admin-overview-grid">
        <Reveal>
          <TiltCard className="admin-overview-card">
            <span>01 / ORGANISE</span>
            <h2>A place for every opportunity.</h2>
            <p>
              Create, rename and remove shared job categories used when
              employers post jobs.
            </p>
            <Button to="/dashboard/admin/categories">
              Manage job categories ↗
            </Button>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.08}>
          <TiltCard className="admin-overview-card admin-card-lime">
            <span>02 / LISTEN</span>
            <h2>Understand the questions.</h2>
            <p>
              Review saved chatbot questions and replies. Search support
              conversations, one page at a time.
            </p>
            <Button to="/dashboard/admin/chatbot-logs" variant="outlined">
              Review chatbot logs ↗
            </Button>
          </TiltCard>
        </Reveal>
      </div>
      <section className="admin-note">
        <span>✦</span>
        <div>
          <h2>Your platform tools.</h2>
          <p>
            This workspace connects the existing job category management and
            chatbot log APIs. Course categories remain in the trainer workspace.
          </p>
        </div>
      </section>
    </>
  );
}
