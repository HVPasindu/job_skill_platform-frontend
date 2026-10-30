import { useState } from "react";
import { useForm } from "react-hook-form";
// MUI supplies dialog focus/escape. Reuse the Step05 MUI/RHF field adapter for ordinary fields.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FormField from "../employer/EmployerField";
import Button from "../ui/Button";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function TrainerDialog({
  title,
  fields,
  record = {},
  onSave,
  onSaved,
  onClose,
}) {
  const [popup, setPopup] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: Object.fromEntries(
      fields.map((f) => [f.name, record[f.name] ?? ""]),
    ),
  });
  async function submit(values) {
    try {
      const result = await onSave(values);
      onClose();
      onSaved?.(result);
      await showSuccess(
        "Your knowledge, a little further",
        "Your changes have been saved.",
      );
    } catch (error) {
      setPopup(true);
      await showError(getApiError(error));
      setPopup(false);
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      className="seeker-dialog trainer-dialog"
      disableEnforceFocus={popup}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="trainer-dialog-title"
    >
      <DialogTitle id="trainer-dialog-title">{title}</DialogTitle>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <div className="seeker-form-grid">
            {fields.map((f) => (
              <FormField
                key={f.name}
                definition={f}
                control={control}
                disabled={isSubmitting}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
