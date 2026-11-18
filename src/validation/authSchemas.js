// Yup validates form fields; yupResolver connects these rules to React Hook Form.
import * as yup from "yup";
const email = yup
  .string()
  .trim()
  .email("Enter a valid email address.")
  .required("Enter your email address.");
export const loginSchema = yup.object({
  email,
  password: yup.string().required("Enter your password."),
});
export const signupSchema = yup.object({
  full_name: yup
    .string()
    .trim()
    .required("Enter your full name.")
    .max(120, "Use 120 characters or fewer."),
  email,
  password: yup
    .string()
    .min(8, "Use at least 8 characters.")
    .required("Create a password."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm your password."),
  role_name: yup
    .string()
    .oneOf(["job_seeker", "employer", "trainer"], "Choose an account type.")
    .required("Choose an account type."),
});
export const otpSchema = yup.object({
  email,
  otp: yup
    .string()
    .matches(/^\d{6}$/, "Enter the 6-digit code from your email.")
    .required("Enter your verification code."),
});
