import { asBoolean } from "./seekerFiles";
export const APPLICATION_STATUSES = [
  "pending",
  "reviewed",
  "shortlisted",
  "accepted",
  "rejected",
  "withdrawn",
];
export const JOB_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
];
export const WORK_MODES = ["on_site", "remote", "hybrid"];
export function words(value) {
  return value ? String(value).replaceAll("_", " ") : "Not specified";
}
export function salary(job) {
  const format = (value) =>
    new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(
      Number(value),
    );
  const min = job.salary_min,
    max = job.salary_max;
  if (min == null && max == null) return "Salary not disclosed";
  if (min == null) return `Up to LKR ${format(max)}`;
  if (max == null) return `From LKR ${format(min)}`;
  return Number(min) === Number(max)
    ? `LKR ${format(min)}`
    : `LKR ${format(min)} – ${format(max)}`;
}
export function dateLabel(value) {
  if (!value) return "Not specified";
  // Calendar-only deadlines stay on the same day in every time zone.
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? `${value}T00:00:00` : value,
  );
  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}
export function canApply(job) {
  if (job.accepting_applications != null)
    return asBoolean(job.accepting_applications);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return (
    job.status === "open" &&
    (!job.application_deadline ||
      String(job.application_deadline).slice(0, 10) >= today)
  );
}
export function pageNumber(params) {
  const page = Number(params.get("page") || 1);
  return Number.isInteger(page) && page > 0 && page <= 100000 ? page : 1;
}
export function applicationPayload(values) {
  return {
    resume_id: values.resume_id || null,
    cover_letter: values.cover_letter.trim(),
  };
}

export function externalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
