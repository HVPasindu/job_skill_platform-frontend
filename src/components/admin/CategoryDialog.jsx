import { useState } from "react";
import { useForm } from "react-hook-form";
// MUI controls dialog focus. The existing MUI/RHF field adapter keeps form code simple.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FormField from "../employer/EmployerField";
import Button from "../ui/Button";
import { supportService } from "../../services/supportService";
import { showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function CategoryDialog({ record, onClose, onSaved }) {
  const [popup, setPopup] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { category_name: record?.category_name || "" },
  });
  async function submit(values) {
    try {
      await supportService.saveCategory(
        { category_name: values.category_name.trim() },
        record?.id,
      );
      onSaved();
      onClose();
      await showSuccess("Category saved", "The job category is ready to use.");
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
      className="admin-dialog"
      disableEnforceFocus={popup}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="category-dialog-title"
    >
      <DialogTitle id="category-dialog-title">
        {record ? "Edit job category" : "Add job category"}
      </DialogTitle>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <FormField
            control={control}
            definition={{
              name: "category_name",
              label: "Category name",
              required: true,
              max: 100,
            }}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save category →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
