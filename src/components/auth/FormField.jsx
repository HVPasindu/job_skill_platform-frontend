// MUI TextField supplies its label, helper text and focus styling.
// React Hook Form's register ref belongs on the actual input, not the TextField wrapper.
import TextField from "@mui/material/TextField";
export default function FormField({ name, register, errors, ...props }) {
  const { ref, ...field } = register(name);
  return (
    <TextField
      fullWidth
      {...props}
      {...field}
      inputRef={ref}
      error={!!errors[name]}
      helperText={errors[name]?.message}
    />
  );
}
