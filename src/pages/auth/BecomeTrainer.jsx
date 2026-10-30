import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import AuthSculpture from "../../components/experience/AuthSculpture";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import { roleHome } from "../../data/roles";
export default function BecomeTrainer() {
  const { user, becomeTrainer } = useAuth();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  if (user.roles.includes("trainer") && !done)
    return <Navigate to={roleHome("trainer")} replace />;
  async function join() {
    if (busy) return;
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Ready to share what you know?",
          "Add the trainer workspace to your account. Your existing roles will stay available.",
          "Become a trainer",
        ))
      )
        return;
      // Mark the view before context changes so the success dialog stays visible.
      setDone(true);
      await becomeTrainer();
      await showSuccess(
        "A new chapter unlocked",
        "Your trainer workspace is ready. Let's make knowledge go further.",
      );
      navigate(roleHome("trainer"), { replace: true });
    } catch (error) {
      setDone(false);
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="become-trainer">
      <div>
        <span className="eyebrow">WHAT YOU KNOW CAN CHANGE WHAT'S NEXT</span>
        <h1 className="workspace-page-title">
          You've learned.
          <br />
          Now, <em>inspire.</em>
        </h1>
        <p className="workspace-page-intro">
          Bring your experience to a new audience. Add a trainer workspace to
          the same SkillJob account.
        </p>
        <ul>
          <li>Keep your current workspaces.</li>
          <li>Switch between roles whenever you need.</li>
          <li>Get ready to create learning and mentorship opportunities.</li>
        </ul>
        <Button onClick={join} disabled={busy}>
          {busy ? "Opening your next chapter…" : "Become a trainer ↗"}
        </Button>
        <p className="form-hint">
          Trainer profile, courses and session tools are coming next.
        </p>
      </div>
      <AuthSculpture />
    </section>
  );
}
