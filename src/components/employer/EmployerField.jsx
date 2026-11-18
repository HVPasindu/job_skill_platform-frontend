// React Hook Form Controller connects MUI TextField/Checkbox without custom form state.
import { Controller } from "react-hook-form";
import { TextField, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { externalUrl, words } from "../../utils/jobFormat";
export default function EmployerField({
  definition,
  control,
  disabled = false,
}) {
  const {
    name,
    label,
    type,
    options,
    required,
    max,
    wide,
    min = 0,
    maxNumber = 9999999999.99,
    step,
    ...other
  } = definition;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (required && !String(value ?? "").trim())
            return `${label} is required.`;
          if (value !== "" && value != null) {
            if (max && String(value).length > max)
              return `Use ${max} characters or fewer.`;
            if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
              return "Enter a valid email address.";
            if (type === "url" && !externalUrl(value))
              return "Use a full https:// or http:// website URL.";
            if (
              type === "number" &&
              (!Number.isFinite(Number(value)) ||
                Number(value) < min ||
                Number(value) > maxNumber)
            )
              return `Enter a number from ${min} to ${maxNumber}.`;
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        if (type === "checkbox")
          return (
            <FormControlLabel
              className={wide ? "field-wide" : ""}
              label={label}
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={disabled}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
            />
          );
        const { ref, ...input } = field;
        const values = options?.map((option) =>
          typeof option === "string"
            ? {
                value: option,
                label:
                  option === "onsite" || option === "on_site"
                    ? "On site"
                    : words(option),
              }
            : option,
        );
        if (
          values &&
          field.value !== "" &&
          !values.some((option) => String(option.value) === String(field.value))
        )
          values.push({ value: field.value, label: words(field.value) });
        return (
          <TextField
            {...input}
            inputRef={ref}
            {...other}
            fullWidth
            className={wide ? "field-wide" : ""}
            label={label}
            required={required}
            type={type || "text"}
            select={!!options}
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              inputLabel: type === "date" ? { shrink: true } : {},
              htmlInput: { maxLength: max, min, max: maxNumber, step },
            }}
          >
            {values && [
              <MenuItem key="none" value="">
                Not specified
              </MenuItem>,
              ...values.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              )),
            ]}
          </TextField>
        );
      }}
    />
  );
}
