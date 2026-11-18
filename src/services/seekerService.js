// Keep the backend contract in one place. Axios sets multipart boundaries for FormData.
import api from "../api/axiosInstance";
async function data(request) {
  const response = await request;
  if (response.data.success === false)
    throw new Error(response.data.message || "Request failed.");
  return response.data;
}
async function missingAsNull(request) {
  try {
    return await data(request);
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}
export const seekerService = {
  listPage: async (kind, params, signal) => {
    const result = await data(
      api.get(`/job-seeker/${kind}`, { params, signal }),
    );
    const key = {
      education: "educations",
      experience: "experiences",
      skills: "skills",
      resumes: "resumes",
    }[kind];
    return { items: result[key] || [], pagination: result.pagination };
  },
  profile: async (signal) =>
    (await missingAsNull(api.get("/job-seeker/profile", { signal })))
      ?.profile || null,
  saveProfile: (values, exists) =>
    data(
      api[exists ? "put" : "post"]("/job-seeker/profile", values, {
        timeout: 60000,
      }),
    ),
  list: async (kind, signal) => {
    const result = await data(api.get(`/job-seeker/${kind}`, { signal }));
    return (
      result[
        {
          education: "educations",
          experience: "experiences",
          skills: "skills",
          resumes: "resumes",
        }[kind]
      ] || []
    );
  },
  saveRecord: (kind, values, id) =>
    data(
      id
        ? api.put(`/job-seeker/${kind}/${id}`, values)
        : api.post(`/job-seeker/${kind}`, values),
    ),
  deleteRecord: (kind, id) => data(api.delete(`/job-seeker/${kind}/${id}`)),
  uploadDocuments: (values) =>
    data(api.post("/job-seeker/resumes", values, { timeout: 120000 })),
  updateDocument: (id, values) =>
    data(api.put(`/job-seeker/resumes/${id}`, values, { timeout: 120000 })),
  primaryDocument: (id) => data(api.put(`/job-seeker/resumes/${id}/primary`)),
  parse: (id) =>
    data(
      api.post(
        id ? `/resumes/${id}/parse` : "/resumes/parse-auto",
        {},
        { timeout: 180000 },
      ),
    ),
  parseResult: async (id, signal) =>
    (
      await missingAsNull(
        api.get(
          id ? `/resumes/${id}/parse-result` : "/resumes/parse-result/latest",
          { signal },
        ),
      )
    )?.parse_result || null,
};
