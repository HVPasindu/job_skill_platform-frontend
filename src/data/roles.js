// Role names match the backend roles table. Company owner/employee are separate memberships.
export const ROLE_DETAILS = {
  job_seeker: {
    label: "Job seeker",
    path: "job-seeker",
    color: "#c7fa76",
    title: "Make your next move.",
    description:
      "Your experience has a destination. Find the opportunities that move you forward.",
    modules: ["My profile", "My documents", "My applications", "My learning"],
  },
  employer: {
    label: "Employer",
    path: "employer",
    color: "#ffb49b",
    title: "Build something great.",
    description:
      "Great teams start with a connection. Bring your company and its next people together.",
    modules: ["My companies", "Manage jobs", "Candidates"],
  },
  trainer: {
    label: "Trainer",
    path: "trainer",
    color: "#b6c5ff",
    title: "Pass your knowledge on.",
    description: "Turn what you know into someone else's next big step.",
    modules: [
      "Trainer profile",
      "My courses",
      "Course materials",
      "My students",
      "My sessions",
    ],
  },
  admin: {
    label: "Administrator",
    path: "admin",
    color: "#ffe594",
    title: "Keep opportunity open.",
    description:
      "A clear view of the platform, with the right tools to keep it moving.",
    modules: ["Job categories", "Chatbot logs"],
  },
};
export function roleHome(role) {
  return `/dashboard/${ROLE_DETAILS[role]?.path || "account"}`;
}
export function roleFromPath(path) {
  return Object.keys(ROLE_DETAILS).find(
    (role) => ROLE_DETAILS[role].path === path,
  );
}
