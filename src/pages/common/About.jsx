// Built-in MUI icons illustrate each audience; the reusable motion wrappers stay separate.
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/experience/Reveal";
import TiltCard from "../../components/experience/TiltCard";
import Button from "../../components/ui/Button";

const audiences = [
  {
    title: "For the next generation of talent",
    description:
      "Create a profile, showcase your experience, and discover work and learning opportunities.",
    Icon: WorkOutlineIcon,
  },
  {
    title: "For teams with a vision",
    description:
      "Build your company presence, share opportunities, and connect with candidates.",
    Icon: BusinessOutlinedIcon,
  },
  {
    title: "For people who share knowledge",
    description:
      "Create courses, share resources, and help others grow through mentorship.",
    Icon: SchoolOutlinedIcon,
  },
];
export default function About() {
  return (
    <div className="page-container section-space">
      <PageHeader
        eyebrow="A BETTER WAY FORWARD"
        title={
          <>
            Opportunity is just
            <br />
            the beginning.
          </>
        }
        description="SkillJob brings work, learning, and mentorship into one connected platform. Because building a career means more than finding a job."
      />
      <div className="pathway-grid">
        {audiences.map(({ title, description, Icon }, index) => (
          <Reveal key={title} delay={index * 0.08}>
            <TiltCard className="surface-card audience-card">
              <Icon color="primary" />
              <h2>{title}</h2>
              <p>{description}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Reveal className="mission-panel">
        <span className="eyebrow">OUR PURPOSE</span>
        <h2>
          Turn potential
          <br />
          into possibility.
        </h2>
        <p>
          We’re creating a space where your experience, curiosity, and ambition
          can meet the right next step.
        </p>
        <Button to="/jobs">Explore opportunities</Button>
      </Reveal>
    </div>
  );
}
