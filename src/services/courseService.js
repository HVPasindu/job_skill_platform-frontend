import api from "../api/axiosInstance";
async function read(path, params = {}, signal) {
  const { data } = await api.get(path, { params, signal });
  if (data.success === false)
    throw new Error(data.message || "Could not load this information.");
  return data;
}
async function write(method, path, values) {
  const { data } = await api[method](path, values, { timeout: 120000 });
  if (data.success === false)
    throw new Error(data.message || "Could not save your changes.");
  return data;
}
export const courseService = {
  profile: async (signal) => {
    try {
      return (await read("/trainer/profile", {}, signal)).profile;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },
  saveProfile: (values, exists) =>
    write(exists ? "put" : "post", "/trainer/profile", values),
  dashboard: (signal) => read("/trainer/dashboard", {}, signal),
  options: (signal) => read("/trainer/course-options", {}, signal),
  categories: (params, signal) => read("/course-categories", params, signal),
  categoryOptions: async (signal) =>
    (await read("/course-categories", {}, signal)).categories,
  addCategory: (values) => write("post", "/course-categories", values),
  mine: (params, signal) => read("/courses/my-courses", params, signal),
  catalogue: (params, signal) => read("/courses", params, signal),
  course: async (id, signal) =>
    (await read(`/courses/${id}`, {}, signal)).course,
  saveCourse: (values, id) =>
    write(id ? "put" : "post", id ? `/courses/${id}` : "/courses", values),
  removeCourse: (id) => write("delete", `/courses/${id}`),
  outline: (id, params, signal) =>
    read(`/courses/${id}/outline`, params, signal),
  materials: (id, params, signal) =>
    read(`/courses/${id}/materials`, params, signal),
  material: async (id, signal) =>
    (await read(`/courses/materials/${id}`, {}, signal)).material,
  saveMaterial: (courseId, values, id) =>
    write(
      id ? "put" : "post",
      id ? `/courses/materials/${id}` : `/courses/${courseId}/materials`,
      values,
    ),
  removeMaterial: (id) => write("delete", `/courses/materials/${id}`),
  files: (id, params, signal) => read(`/materials/${id}/files`, params, signal),
  saveFile: (materialId, values, fileId) =>
    write(
      fileId ? "put" : "post",
      fileId ? `/materials/files/${fileId}` : `/materials/${materialId}/files`,
      values,
    ),
  removeFile: (id) => write("delete", `/materials/files/${id}`),
};
