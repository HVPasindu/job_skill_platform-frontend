import { useState } from "react";
import { useForm } from "react-hook-form";
// MUI Dialog supplies focus/escape behavior; SweetAlert2 handles save feedback.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EmployerField from "./EmployerField";
import FilePicker from "../seeker/FilePicker";
import Button from "../ui/Button";
import { asBoolean } from "../../utils/seekerFiles";
import { showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function EditorDialog({
  title,
  fields,
  record = {},
  imageUrl,
  onSave,
  onSaved,
  onClose,
  logo = false,
  locked = [],
  message = "Your changes are saved.",
}) {
  const [file, setFile] = useState(null);
  const [popup, setPopup] = useState(false);
  const defaults = Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.type === "checkbox"
        ? asBoolean(record[field.name])
        : (record[field.name] ?? ""),
    ]),
  );
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });
  async function submit(values) {
    try {
      const result = await onSave(
        Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]),
        ),
        file,
      );
      onClose();
      onSaved?.(result);
      await showSuccess("A good move, saved", message);
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
      maxWidth="md"
      className="seeker-dialog employer-dialog"
      disableEnforceFocus={popup}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="employer-editor-title"
    >
      <DialogTitle id="employer-editor-title">{title}</DialogTitle>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogContent>
          {logo && (
            <FilePicker
              image
              label="Choose company logo"
              existingImage={imageUrl}
              disabled={isSubmitting}
              onChange={(files) => setFile(files[0] || null)}
            />
          )}
          <div className="seeker-form-grid">
            {fields.map((field) => (
              <EmployerField
                key={field.name}
                definition={field}
                control={control}
                disabled={isSubmitting || locked.includes(field.name)}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="text"
            disabled={isSubmitting}
            onClick={onClose}
          >
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
