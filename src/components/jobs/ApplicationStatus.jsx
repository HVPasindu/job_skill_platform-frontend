import { words } from "../../utils/jobFormat";
export default function ApplicationStatus({ status }) {
  return (
    <span className={`application-status status-${status}`}>
      {words(status)}
    </span>
  );
}
