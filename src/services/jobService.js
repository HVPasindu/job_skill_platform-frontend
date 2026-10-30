import api from "../api/axiosInstance";
async function get(path, params, signal) {
  const { data } = await api.get(path, { params, signal });
  if (data.success === false)
    throw new Error(data.message || "The request failed.");
  return data;
}
async function write(method, path, values) {
  const { data } = await api[method](path, values);
  if (data.success === false)
    throw new Error(data.message || "The request failed.");
  return data;
}
export const jobService = {
  search: (params, signal) => get("/jobs", params, signal),
  categories: async (signal) =>
    (await get("/job-categories", {}, signal)).categories || [],
  detail: async (id, signal) => (await get(`/jobs/${id}`, {}, signal)).job,
  skills: async (id, signal) =>
    (await get(`/jobs/${id}/skills`, {}, signal)).skills || [],
  applications: (params, signal) =>
    get("/job-applications/my-applications", params, signal),
  application: async (id, signal) =>
    (await get(`/job-applications/${id}`, {}, signal)).application,
  history: async (id, signal) =>
    (await get(`/job-applications/${id}/status-history`, {}, signal)).history ||
    [],
  apply: (id, values) => write("post", `/jobs/${id}/apply`, values),
  update: (id, values) => write("put", `/job-applications/${id}`, values),
  withdraw: (id) => write("put", `/job-applications/${id}/withdraw`, {}),
  dashboard: (signal) => get("/job-seeker/dashboard", {}, signal),
};
