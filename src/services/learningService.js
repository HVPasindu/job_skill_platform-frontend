import api from "../api/axiosInstance";
async function read(path, params = {}, signal) {
  const { data } = await api.get(path, { params, signal });
  if (data.success === false)
    throw new Error(data.message || "Could not load this information.");
  return data;
}
async function write(method, path, values) {
  const { data } = await api[method](path, values);
  if (data.success === false)
    throw new Error(data.message || "Could not save your changes.");
  return data;
}
export const learningService = {
  mine: (params, signal) =>
    read("/course-enrollments/my-enrollments", params, signal),
  enrollment: async (id, signal) =>
    (await read(`/course-enrollments/${id}`, {}, signal)).enrollment,
  forCourse: async (id, signal) =>
    (await read(`/courses/${id}/my-enrollment`, {}, signal)).enrollment,
  enroll: (id) => write("post", `/courses/${id}/enroll`),
  cancel: (id) => write("put", `/course-enrollments/${id}/cancel`),
  complete: (id) => write("put", `/course-enrollments/${id}/complete`),
  students: (params, signal) => read("/trainer/students", params, signal),
  courseStudents: (id, params, signal) =>
    read(`/courses/${id}/enrollments`, params, signal),
};
export const mentorshipService = {
  public: (params, signal) => read("/mentorship-sessions", params, signal),
  mine: (params, signal) =>
    read("/mentorship-sessions/my-sessions", params, signal),
  joined: (params, signal) => read("/mentorship/my-sessions", params, signal),
  session: async (id, signal) =>
    (await read(`/mentorship-sessions/${id}`, {}, signal)).session,
  save: (values, id) =>
    write(
      id ? "put" : "post",
      id ? `/mentorship-sessions/${id}` : "/mentorship-sessions",
      values,
    ),
  remove: (id) => write("delete", `/mentorship-sessions/${id}`),
  join: (id) => write("post", `/mentorship/sessions/${id}/join`),
  leave: (id) => write("delete", `/mentorship/sessions/${id}/leave`),
  participants: (id, params, signal) =>
    read(`/mentorship/sessions/${id}/participants`, params, signal),
};
