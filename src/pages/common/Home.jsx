// MUI built-in icon, used only as a normal visual inside a button.
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
import ImmersiveHero from "../../components/experience/ImmersiveHero";
import AnimatedHeadline from "../../components/experience/AnimatedHeadline";
import KineticMarquee from "../../components/experience/KineticMarquee";
import TextReveal from "../../components/experience/TextReveal";
import StickyJourney from "../../components/experience/StickyJourney";

// Simple content only. All scroll, pointer and WebGL code is in experience/.
const pathways = [
  {
    number: "01",
    title: "Find your place.",
    description:
      "Explore roles that fit your skills, your curiosity, and the person you’re becoming.",
    to: "/jobs",
    action: "Explore opportunities",
    tone: "blue",
    symbol: "↗",
  },
  {
    number: "02",
    title: "Build your edge.",
    description:
      "Make room for practical learning. Turn what you know into what you can do next.",
    to: "/courses",
    action: "Discover learning",
    tone: "lime",
    symbol: "✳",
  },
  {
    number: "03",
    title: "Change your view.",
    description:
      "Find a mentor, start a conversation, and see possibilities you hadn’t considered.",
    to: "/sessions",
    action: "Explore mentorship",
    tone: "orange",
    symbol: "◎",
  },
];
export default function Home() {
  return (
    <>
      <ImmersiveHero>
        <Reveal>
          <span className="eyebrow">
            <span className="status-dot" />A NEW KIND OF CAREER PLATFORM
          </span>
          <AnimatedHeadline />
          <p className="hero-description">
            Good work. Useful skills. People who inspire you. Discover the
            possibilities that move you forward.
          </p>
          <div className="hero-actions">
            <Button to="/jobs" endIcon={<ArrowOutwardRoundedIcon />}>
              Find your opportunity
            </Button>
            <Button to="/courses" variant="outlined">
              Explore learning
            </Button>
          </div>
          <div className="hero-audiences">
            <span>Job seekers</span>
            <span>Employers</span>
            <span>Trainers</span>
          </div>
        </Reveal>
      </ImmersiveHero>
      <KineticMarquee />
      <div className="page-container">
        <TextReveal text="Your career is more than a job title. It’s the skills you build, the people you meet, and the moves you choose to make." />
      </div>
      <StickyJourney items={pathways} />
      <section className="page-container chapter-section">
        <Reveal className="chapter-panel">
          <div className="chapter-art" aria-hidden="true">
            <div className="chapter-ring" />
            <span>↗</span>
          </div>
          <div>
            <span className="eyebrow">FOR EVERY KIND OF AMBITION</span>
            <h2>
              Your next chapter.
              <br />
              <em>Your way.</em>
            </h2>
            <p>
              Starting out, growing a team, or sharing what you know? Find your
              place in a community built around possibility.
            </p>
            <Button to="/about" endIcon={<ArrowOutwardRoundedIcon />}>
              Meet SkillJob
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
