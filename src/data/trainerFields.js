export const trainerFields = [
  { name: "phone", label: "Phone number", max: 20 },
  { name: "specialization", label: "Specialization", max: 150 },
  {
    name: "years_of_experience",
    label: "Years of experience",
    type: "number",
    step: 1,
    maxNumber: 100,
  },
  { name: "qualification", label: "Qualification", max: 150 },
  {
    name: "website_url",
    label: "Website URL",
    type: "url",
    max: 255,
    wide: true,
  },
  {
    name: "bio",
    label: "Your trainer introduction",
    multiline: true,
    rows: 5,
    max: 10000,
    wide: true,
  },
];
export function courseFields(options, categories) {
  return [
    {
      name: "title",
      label: "Course title",
      required: true,
      max: 150,
      wide: true,
    },
    {
      name: "short_description",
      label: "Short description",
      required: true,
      max: 255,
      multiline: true,
      rows: 2,
      wide: true,
    },
    {
      name: "course_category_id",
      label: "Course category",
      options: categories.map((c) => ({
        value: String(c.id),
        label: c.category_name,
      })),
    },
    {
      name: "level",
      label: "Course level",
      options: ["beginner", "intermediate", "advanced"],
    },
    { name: "duration_text", label: "Duration", max: 50 },
    {
      name: "course_type",
      label: "Course type",
      options: options.course_types,
      required: true,
    },
    {
      name: "status",
      label: "Course status",
      options: options.statuses,
      required: true,
    },
    {
      name: "full_description",
      label: "Full description",
      multiline: true,
      rows: 7,
      max: 20000,
      wide: true,
    },
  ];
}
export function materialFields(options) {
  return [
    {
      name: "title",
      label: "Material title",
      required: true,
      max: 150,
      wide: true,
    },
    {
      name: "material_type",
      label: "Material type",
      options: options.material_types,
      required: true,
    },
    {
      name: "sort_order",
      label: "Display order",
      type: "number",
      step: 1,
      maxNumber: 2147483647,
    },
    {
      name: "external_url",
      label: "Material link (optional)",
      type: "url",
      max: 255,
      wide: true,
    },
  ];
}
// Browser FormData sets its own multipart boundary. Empty strings clear optional form fields.
export function trainerPayload(values, file, field = "profile_image") {
  const payload = new FormData();
  for (const [name, value] of Object.entries(values))
    payload.append(
      name,
      typeof value === "string" ? value.trim() : (value ?? ""),
    );
  if (file) payload.append(field, file);
  return payload;
}
export function materialPayload(values) {
  if (values.sort_order !== "" && !Number.isInteger(Number(values.sort_order)))
    throw new Error("Display order must be a whole number.");
  return {
    ...values,
    title: values.title.trim(),
    external_url: values.external_url.trim() || null,
    sort_order: values.sort_order === "" ? null : Number(values.sort_order),
  };
}
