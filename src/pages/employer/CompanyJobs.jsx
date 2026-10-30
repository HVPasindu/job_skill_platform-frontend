import { useOutletContext } from "react-router-dom";
import JobList from "../../components/employer/JobList";
export default function CompanyJobs() {
  const { company } = useOutletContext();
  return <JobList company={company} />;
}
