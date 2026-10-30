import api from "../api/axiosInstance";
const publicConfig = { skipAuth: true };
async function post(path, values, config) {
  const { data } = await api.post(`/auth/${path}`, values, config);
  if (data.success === false)
    throw new Error(data.message || "The request could not be completed.");
  return data;
}
export const authService = {
  login: (values) => post("login", values, publicConfig),
  signup: (values) => post("signup", values, publicConfig),
  verifyOtp: (values) => post("verify-otp", values, publicConfig),
  resendOtp: (email) => post("resend-otp", { email }, publicConfig),
  becomeTrainer: () => post("become-trainer", {}),
};
