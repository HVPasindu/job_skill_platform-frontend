import api from "../api/axiosInstance";
async function read(path, params, signal) {
  const { data } = await api.get(path, { params, signal });
  if (data.success === false)
    throw new Error(data.message || "Could not load this information.");
  return data;
}
async function write(method, path, values) {
  const { data } = await api[method](path, values, { timeout: 60000 });
  if (data.success === false)
    throw new Error(data.message || "Could not save your changes.");
  return data;
}
export const employerService = {
  dashboard: (signal) => read("/company/dashboard", {}, signal),
  companies: (params, signal) => read("/company/my-companies", params, signal),
  company: async (id, signal) =>
    (await read(`/company/${id}`, {}, signal)).company,
  saveCompany: (values, id) =>
    write(id ? "put" : "post", id ? `/company/${id}` : "/company", values),
  members: (id, params, signal) => read(`/company/${id}/users`, params, signal),
  saveMember: (companyId, values, id) =>
    write(
      id ? "put" : "post",
      id
        ? `/company/${companyId}/users/${id}`
        : `/company/${companyId}/add-user`,
      values,
    ),
  removeMember: (companyId, id) =>
    write("delete", `/company/${companyId}/users/${id}`),
  jobs: (id, params, signal) => read(`/company/${id}/jobs`, params, signal),
  managedJobs: (params, signal) => read("/company/jobs", params, signal),
  job: async (companyId, id, signal) =>
    (await read(`/company/${companyId}/jobs/${id}`, {}, signal)).job,
  jobOptions: (signal) => read("/company/job-options", {}, signal),
  saveJob: (values, id) =>
    write(id ? "put" : "post", id ? `/jobs/${id}` : "/jobs", values),
  removeJob: (id) => write("delete", `/jobs/${id}`),
  skillsPage: (jobId, params, signal) =>
    read(`/jobs/${jobId}/skills`, params, signal),
  saveSkill: (jobId, values, skillId) =>
    write(
      skillId ? "put" : "post",
      skillId ? `/jobs/${jobId}/skills/${skillId}` : `/jobs/${jobId}/skills`,
      values,
    ),
  removeSkill: (jobId, skillId) =>
    write("delete", `/jobs/${jobId}/skills/${skillId}`),
  candidates: (params, signal) => read("/company/applications", params, signal),
  jobCandidates: (jobId, params, signal) =>
    read(`/jobs/${jobId}/applications`, params, signal),
  updateStatus: (id, values) =>
    write("put", `/job-applications/${id}/status`, values),
};
