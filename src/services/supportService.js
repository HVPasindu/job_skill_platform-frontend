import api from "../api/axiosInstance";
async function read(path, params, signal) {
  const { data } = await api.get(path, { params, signal });
  if (data.success === false)
    throw new Error(data.message || "Could not load this information.");
  return data;
}
async function write(method, path, values, options = {}) {
  const { data } = await api[method](path, values, options);
  if (data.success === false)
    throw new Error(data.message || "Could not save this change.");
  return data;
}
export const supportService = {
  // Questions use the existing backend rule-based answers + optional AI fallback.
  ask: (question, signal) =>
    write("post", "/chatbot/ask", { question }, { signal, timeout: 30000 }),
  logs: (params, signal) => read("/chatbot/logs", params, signal),
  categories: (params, signal) => read("/job-categories", params, signal),
  saveCategory: (values, id) =>
    write(
      id ? "put" : "post",
      id ? `/job-categories/${id}` : "/job-categories",
      values,
    ),
  removeCategory: (id) => write("delete", `/job-categories/${id}`),
};
