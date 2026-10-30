// Plain field definitions keep normal form pages readable. Backend columns are VARCHARs.
export const JOB_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
];
export const profileFields = [
  {
    name: "phone",
    label: "Phone number",
    max: 20,
    required: true,
    autoComplete: "tel",
  },
  {
    name: "city",
    label: "City",
    max: 100,
    required: true,
    autoComplete: "address-level2",
  },
  {
    name: "country",
    label: "Country",
    max: 100,
    required: true,
    autoComplete: "country-name",
  },
  {
    name: "preferred_job_role",
    label: "Preferred job role",
    max: 150,
    required: true,
  },
  {
    name: "preferred_job_type",
    label: "Preferred job type",
    options: JOB_TYPES,
    required: true,
  },
  {
    name: "experience_level",
    label: "Experience level",
    options: ["entry", "junior", "mid", "senior", "lead"],
    required: true,
  },
  {
    name: "expected_salary",
    label: "Expected monthly salary (LKR)",
    type: "number",
    min: 0,
    maxNumber: 9999999999.99,
    step: "0.01",
  },
  {
    name: "bio",
    label: "About you",
    multiline: true,
    rows: 4,
    max: 3000,
    wide: true,
  },
];
export const recordSections = {
  education: {
    title: "Education",
    singular: "education",
    heading: "A foundation for your future.",
    description: "The places you've learned. The ideas you'll take further.",
    fields: [
      {
        name: "qualification",
        label: "Qualification",
        required: true,
        max: 150,
      },
      {
        name: "institute_name",
        label: "Institute name",
        required: true,
        max: 150,
      },
      { name: "field_of_study", label: "Field of study", max: 150 },
      { name: "grade", label: "Grade / result", max: 50 },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      {
        name: "description",
        label: "Description",
        multiline: true,
        rows: 3,
        max: 3000,
        wide: true,
      },
    ],
  },
  experience: {
    title: "Experience",
    singular: "experience",
    heading: "Every chapter counts.",
    description:
      "Show the work, the learning and the progress behind your next move.",
    fields: [
      { name: "job_title", label: "Job title", required: true, max: 150 },
      { name: "company_name", label: "Company name", required: true, max: 150 },
      { name: "employment_type", label: "Employment type", options: JOB_TYPES },
      { name: "start_date", label: "Start date", type: "date", required: true },
      {
        name: "is_current",
        label: "I currently work here",
        type: "checkbox",
        wide: true,
      },
      { name: "end_date", label: "End date", type: "date" },
      {
        name: "description",
        label: "Description",
        multiline: true,
        rows: 3,
        max: 3000,
        wide: true,
      },
    ],
  },
  skills: {
    title: "Skills",
    singular: "skill",
    heading: "What makes you, you.",
    description:
      "Give your strengths a name. Let your next opportunity find them.",
    fields: [
      { name: "skill_name", label: "Skill name", required: true, max: 100 },
      {
        name: "proficiency_level",
        label: "Proficiency level",
        options: ["beginner", "intermediate", "advanced", "expert"],
      },
      {
        name: "years_of_experience",
        label: "Years of experience",
        type: "number",
        min: 0,
        maxNumber: 99.9,
        step: "0.1",
      },
    ],
  },
};
export function readable(value) {
  return value ? String(value).replaceAll("_", " ") : "Not specified";
}
