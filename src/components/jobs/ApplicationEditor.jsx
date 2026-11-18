import { useState } from "react";
import { useForm } from "react-hook-form";
// MUI Dialog controls focus; SweetAlert errors temporarily receive focus above it.
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useApiResource from "../../hooks/useApiResource";
import { seekerService } from "../../services/seekerService";
import { jobService } from "../../services/jobService";
import { applicationPayload } from "../../utils/jobFormat";
import { getApiError } from "../../utils/apiError";
import { showError, showSuccess } from "../../utils/alerts";
import ApplicationFields from "./ApplicationFields";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
const loadResumes = (signal) => seekerService.list("resumes", signal);
export default function ApplicationEditor({ application, onClose, onSaved }) {
  const resource = useApiResource(loadResumes);
  const [alertOpen, setAlertOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      resume_id: application.resume_id ? String(application.resume_id) : "",
      cover_letter: application.cover_letter || "",
    },
  });
  async function submit(values) {
    try {
      await jobService.update(application.id, applicationPayload(values));
      onSaved();
      onClose();
      await showSuccess(
        "Your introduction, updated",
        "Your pending application has been saved.",
      );
    } catch (error) {
      setAlertOpen(true);
      await showError(getApiError(error));
      setAlertOpen(false);
      if (error.response?.status === 409) {
        onSaved();
        onClose();
      }
    }
  }
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      className="seeker-dialog application-editor"
      disableEnforceFocus={alertOpen}
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby="application-editor-title"
    >
      <DialogTitle id="application-editor-title">
        Edit pending application
      </DialogTitle>
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogContent>
          {resource.loading ? (
            <Loading />
          ) : resource.error ? (
            <ErrorState message={resource.error} onRetry={resource.reload} />
          ) : (
            <ApplicationFields
              control={control}
              resumes={resource.data}
              disabled={isSubmitting}
            />
          )}
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
          <Button
            type="submit"
            disabled={isSubmitting || resource.loading || !!resource.error}
          >
            {isSubmitting ? "Saving…" : "Save application →"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
