// Built-in MUI Alert displays the backend error message.
import Alert from "@mui/material/Alert";
import Button from "./Button";
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="space-y-4" role="alert">
      <Alert severity="error">{message}</Alert>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
