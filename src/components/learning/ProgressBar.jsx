// MUI LinearProgress supplies accessible progress semantics. Values come from the enrollment API.
import LinearProgress from "@mui/material/LinearProgress";
import { progress } from "../../utils/learningFormat";
export default function ProgressBar({ value }) {
  const percent = progress(value);
  return (
    <div className="learning-progress">
      <div>
        <span>Course progress</span>
        <strong>{percent}%</strong>
      </div>
      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label="Course progress"
      />
    </div>
  );
}
