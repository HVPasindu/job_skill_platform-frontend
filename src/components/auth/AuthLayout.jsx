import { useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../experience/Reveal";
import AuthSculpture from "../experience/AuthSculpture";
export default function AuthLayout({ eyebrow, title, description, children }) {
  // A new auth page starts at the form header, including on small screens.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <main className="auth-page auth-v2">
      <aside className="auth-art">
        <Link to="/" className="brand" aria-label="SkillJob home">
          <span className="brand-mark">↗</span>skilljob.
        </Link>
        <Reveal>
          <span className="eyebrow">KEEP YOUR AMBITION MOVING</span>
          <h1>
            Small steps.
            <br />
            <em>Big futures.</em>
          </h1>
          <p>
            Find your people.
            <br />
            Build your next chapter.
          </p>
        </Reveal>
        <AuthSculpture />
        <div className="auth-art-foot">
          <span>One account. More possibilities.</span>
          <span>01 — ∞</span>
        </div>
      </aside>
      <section className="auth-content">
        <div className="auth-card">
          <Link to="/" className="auth-back">
            ← Back to SkillJob
          </Link>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
