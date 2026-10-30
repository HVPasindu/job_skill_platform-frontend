// Built-in MUI icons are decorative. All page content below is ordinary JSX.
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Real support contact details have not been supplied. Do not invent them.
export default function Contact() {
  return (
    <div className="page-container section-space">
      <PageHeader
        eyebrow="LET’S FIND YOUR WAY"
        title={
          <>
            A little guidance.
            <br />A clearer next step.
          </>
        }
        description="Looking for opportunities, learning, or mentorship? Start with the path that fits what you need."
      />
      <div className="contact-grid">
        <Card className="p-8">
          <ExploreOutlinedIcon color="primary" />
          <h2>Explore the platform</h2>
          <p>
            Find open jobs, discover learning opportunities, or explore
            mentorship sessions.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button to="/jobs">Find jobs</Button>
            <Button to="/sessions" variant="outlined">
              Find mentorship
            </Button>
          </div>
        </Card>
        <Card className="p-8">
          <HelpOutlineIcon color="primary" />
          <h2>Need help with your account?</h2>
          <p>
            Return to sign in to continue. This page will show verified support
            contact details when they are provided.
          </p>
          <Button to="/login" variant="outlined">
            Go to sign in
          </Button>
        </Card>
      </div>
    </div>
  );
}
