export const companyFields = [
  { name: "company_name", label: "Company name", required: true, max: 150 },
  { name: "company_email", label: "Company email", type: "email", max: 150 },
  { name: "company_phone", label: "Company phone", max: 20 },
  { name: "website_url", label: "Website URL", type: "url", max: 255 },
  { name: "industry", label: "Industry", max: 100 },
  { name: "company_size", label: "Company size", max: 50 },
  { name: "address_line", label: "Address", max: 255 },
  { name: "city", label: "City", max: 100 },
  { name: "country", label: "Country", max: 100 },
  {
    name: "description",
    label: "About the company",
    multiline: true,
    rows: 4,
    max: 10000,
    wide: true,
  },
];
export const contactFields = [
  { name: "job_title", label: "Your job title", max: 100 },
  { name: "department", label: "Your department", max: 100 },
  {
    name: "bio",
    label: "Your company introduction",
    multiline: true,
    rows: 3,
    max: 3000,
    wide: true,
  },
];
export const memberFields = [
  {
    name: "company_role",
    label: "Company role",
    options: ["owner", "employee"],
    required: true,
  },
  { name: "is_primary_contact", label: "Primary contact", type: "checkbox" },
  { name: "job_title", label: "Job title", max: 100 },
  { name: "department", label: "Department", max: 100 },
  {
    name: "bio",
    label: "Introduction",
    multiline: true,
    rows: 3,
    max: 3000,
    wide: true,
  },
];
export function jobFields(options, categories) {
  return [
    { name: "title", label: "Job title", required: true, max: 150 },
    {
      name: "job_category_id",
      label: "Job category",
      options: categories.map((item) => ({
        value: String(item.id),
        label: item.category_name,
      })),
    },
    { name: "location", label: "Location", max: 150 },
    {
      name: "work_mode",
      label: "Work mode",
      options: options.work_modes,
      required: true,
    },
    {
      name: "job_type",
      label: "Job type",
      options: options.job_types,
      required: true,
    },
    {
      name: "experience_level",
      label: "Experience level",
      options: ["entry", "junior", "mid", "senior", "lead"],
    },
    {
      name: "salary_min",
      label: "Minimum monthly salary (LKR)",
      type: "number",
      step: "0.01",
    },
    {
      name: "salary_max",
      label: "Maximum monthly salary (LKR)",
      type: "number",
      step: "0.01",
    },
    {
      name: "application_deadline",
      label: "Application deadline",
      type: "date",
    },
    {
      name: "status",
      label: "Job status",
      options: options.statuses,
      required: true,
    },
    {
      name: "description",
      label: "Job description",
      multiline: true,
      rows: 7,
      max: 20000,
      wide: true,
      required: true,
    },
  ];
}
export function companyPayload(values, file) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) =>
    data.append(key, value ?? ""),
  );
  if (file) data.append("company_logo", file);
  return data;
}
export function jobPayload(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() || null : value,
    ]),
  );
}
