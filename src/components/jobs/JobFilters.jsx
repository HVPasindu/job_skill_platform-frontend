import { useState } from "react";
// MUI TextField/select supplies accessible labels; submit applies filters without per-key requests.
import { TextField, MenuItem } from "@mui/material";
import Button from "../ui/Button";
import { JOB_TYPES, WORK_MODES, words } from "../../utils/jobFormat";
const keys = [
  "search",
  "location",
  "job_type",
  "work_mode",
  "experience_level",
  "category_id",
  "min_salary",
  "max_salary",
];
export default function JobFilters({
  params,
  categories,
  categoriesError,
  retryCategories,
  onApply,
  onClear,
}) {
  const [values, setValues] = useState(
    Object.fromEntries(keys.map((key) => [key, params.get(key) || ""])),
  );
  const [error, setError] = useState("");
  function change(event) {
    setValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }
  function submit(event) {
    event.preventDefault();
    const min = values.min_salary,
      max = values.max_salary;
    if (
      [min, max].some(
        (value) =>
          value !== "" &&
          (!Number.isFinite(Number(value)) ||
            Number(value) < 0 ||
            Number(value) > 9999999999.99),
      )
    ) {
      setError("Enter a valid, non-negative salary range.");
      return;
    }
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setError("Minimum salary cannot exceed maximum salary.");
      return;
    }
    setError("");
    onApply(
      Object.fromEntries(
        Object.entries(values)
          .map(([key, value]) => [key, value.trim()])
          .filter(([, value]) => value !== ""),
      ),
    );
  }
  function select(name, label, choices) {
    const options =
      values[name] && !choices.some(([value]) => String(value) === values[name])
        ? [...choices, [values[name], "Selected filter"]]
        : choices;
    return (
      <TextField
        select
        fullWidth
        size="small"
        name={name}
        label={label}
        value={values[name]}
        onChange={change}
      >
        <MenuItem value="">Any</MenuItem>
        {options.map(([value, text]) => (
          <MenuItem key={value} value={String(value)}>
            {text}
          </MenuItem>
        ))}
      </TextField>
    );
  }
  return (
    <form className="job-filters" noValidate onSubmit={submit}>
      <div className="job-search-row">
        <TextField
          fullWidth
          name="search"
          label="Role, skill or company"
          value={values.search}
          onChange={change}
          slotProps={{ htmlInput: { maxLength: 150 } }}
        />
        <TextField
          fullWidth
          name="location"
          label="Location"
          value={values.location}
          onChange={change}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
        <Button type="submit">Find my next move ↗</Button>
      </div>
      <details className="job-filter-details" open={!!error || undefined}>
        <summary>Refine your search +</summary>
        <div className="job-filter-grid">
          {select(
            "job_type",
            "Job type",
            JOB_TYPES.map((value) => [value, words(value)]),
          )}
          {select(
            "work_mode",
            "Work mode",
            WORK_MODES.map((value) => [value, words(value)]),
          )}
          {select(
            "experience_level",
            "Experience level",
            ["entry", "junior", "mid", "senior", "lead"].map((value) => [
              value,
              words(value),
            ]),
          )}
          {select(
            "category_id",
            "Category",
            categories.map((item) => [item.id, item.category_name]),
          )}
          <TextField
            name="min_salary"
            label="Salary from (LKR)"
            type="number"
            value={values.min_salary}
            onChange={change}
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
          <TextField
            name="max_salary"
            label="Salary to (LKR)"
            type="number"
            value={values.max_salary}
            onChange={change}
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
        </div>
        <p>
          Salary filters match advertised ranges that overlap yours. Undisclosed
          salaries do not match a salary filter.
        </p>
        {categoriesError && (
          <p className="jobs-inline-error">
            Categories could not be loaded.{" "}
            <button type="button" onClick={retryCategories}>
              Retry categories
            </button>
          </p>
        )}
      </details>
      {error && (
        <p className="jobs-inline-error" role="alert">
          {error}
        </p>
      )}
      <div className="job-filter-footer">
        <span>Make room for something that fits.</span>
        <button
          type="button"
          onClick={() => {
            setValues(Object.fromEntries(keys.map((key) => [key, ""])));
            setError("");
            onClear();
          }}
        >
          Clear filters
        </button>
      </div>
    </form>
  );
}
