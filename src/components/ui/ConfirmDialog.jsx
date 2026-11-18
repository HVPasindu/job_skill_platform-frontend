// Built-in MUI Dialog components handle modal focus and keyboard behavior.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Button from "./Button";
export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  busy = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-title"
    >
      <DialogTitle id="confirm-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" disabled={busy} onClick={onConfirm}>
          {busy ? "Please wait…" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
