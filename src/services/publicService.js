import api from "../api/axiosInstance";

// These URLs match the Express routes in your uploaded backend.
export async function getPublicJobs(signal) {
  const response = await api.get("/jobs", { signal });
  return response.data.jobs || [];
}
export async function getPublicSessions(signal) {
  const response = await api.get("/mentorship-sessions", { signal });
  return response.data.sessions || [];
}
// Public course browsing needs a backend list endpoint. We add that in Step 06.
