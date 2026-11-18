import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
export default function NotFound() {
  return (
    <div className="page-container not-found">
      <Reveal>
        <span className="eyebrow">A SMALL DETOUR</span>
        <div className="error-number">
          404<span>↗</span>
        </div>
        <h1>Let’s find a better direction.</h1>
        <p>This page doesn’t exist. Your next opportunity still does.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button to="/">Back to home</Button>
          <Button to="/jobs" variant="outlined">
            Explore jobs
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
