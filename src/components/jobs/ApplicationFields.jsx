// React Hook Form Controller connects MUI inputs. The ref belongs on the actual input.
import { Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";
export default function ApplicationFields({ control, resumes, disabled }) {
  return (
    <div className="application-fields">
      <Controller
        name="resume_id"
        control={control}
        render={({ field }) => {
          const { ref, ...input } = field;
          const missing =
            input.value &&
            !resumes.some((doc) => String(doc.id) === input.value);
          return (
            <TextField
              {...input}
              inputRef={ref}
              select
              fullWidth
              label="Resume attachment"
              disabled={disabled}
            >
              <MenuItem value="">No attachment</MenuItem>
              {missing && (
                <MenuItem value={input.value}>
                  Previous attachment (choose a current document or none)
                </MenuItem>
              )}
              {resumes.map((doc) => (
                <MenuItem key={doc.id} value={String(doc.id)}>
                  {doc.file_name} · {doc.document_type}
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      />
      <p className="form-hint">
        Choose one of your uploaded documents, preferably a CV. You can also
        apply without an attachment.
      </p>
      <Controller
        name="cover_letter"
        control={control}
        rules={{
          maxLength: {
            value: 10000,
            message: "Use 10000 characters or fewer.",
          },
        }}
        render={({ field, fieldState }) => {
          const { ref, ...input } = field;
          return (
            <TextField
              {...input}
              inputRef={ref}
              fullWidth
              multiline
              rows={7}
              label="Cover letter (optional)"
              disabled={disabled}
              error={!!fieldState.error}
              helperText={
                fieldState.error?.message ||
                "Tell the company what makes this opportunity right for you."
              }
              slotProps={{ htmlInput: { maxLength: 10000 } }}
            />
          );
        }}
      />
    </div>
  );
}
