// React Hook Form Controller connects MUI controlled fields and their accessible labels.
import { Controller } from "react-hook-form";
import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { readable } from "../../data/seekerFields";
export default function SeekerField({
  definition,
  control,
  disabled = false,
  dateRules,
}) {
  const {
    name,
    label,
    type,
    options,
    required,
    max,
    min,
    maxNumber,
    step,
    wide,
    ...other
  } = definition;
  const rules = {
    required: required ? `${label} is required.` : false,
    maxLength: max
      ? { value: max, message: `Use ${max} characters or fewer.` }
      : undefined,
    validate: (value) => {
      if (required && !String(value ?? "").trim())
        return `${label} is required.`;
      if (
        type === "number" &&
        value !== "" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < min ||
          Number(value) > maxNumber)
      )
        return `Enter a number from ${min} to ${maxNumber}.`;
      if (
        name === "end_date" &&
        dateRules &&
        !dateRules.current &&
        value &&
        dateRules.start &&
        value < dateRules.start
      )
        return "End date cannot be before start date.";
      return true;
    },
  };
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        if (type === "checkbox")
          return (
            <FormControlLabel
              className={wide ? "field-wide" : ""}
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={disabled}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label={label}
            />
          );
        const { ref, ...input } = field;
        const choices =
          options && field.value && !options.includes(field.value)
            ? [...options, field.value]
            : options;
        return (
          <TextField
            {...input}
            inputRef={ref}
            {...other}
            className={wide ? "field-wide" : ""}
            fullWidth
            label={label}
            required={required}
            type={type || "text"}
            disabled={disabled}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            select={!!options}
            slotProps={{
              inputLabel: type === "date" ? { shrink: true } : {},
              htmlInput: { maxLength: max, min, max: maxNumber, step },
            }}
          >
            {choices && [
              <MenuItem key="blank" value="">
                Not specified
              </MenuItem>,
              ...choices.map((value) => (
                <MenuItem key={value} value={value}>
                  {readable(value)}
                </MenuItem>
              )),
            ]}
          </TextField>
        );
      }}
    />
  );
}
