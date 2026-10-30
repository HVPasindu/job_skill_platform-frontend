import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
export default function PublicCourses() {
  return (
    <div className="page-container section-space">
      <PageHeader
        eyebrow="MAKE ROOM FOR WHAT’S NEXT"
        title={
          <>
            New skills.
            <br />
            New possibilities.
          </>
        }
        description="Practical learning, shared knowledge, and a little momentum for your next chapter."
      />
      <EmptyState
        title="A new chapter in learning."
        description="Our learning catalogue is being prepared. Check back soon for courses, resources, and new ways to grow."
      >
        <Button to="/sessions" variant="outlined">
          Explore mentorship
        </Button>
      </EmptyState>
    </div>
  );
}
