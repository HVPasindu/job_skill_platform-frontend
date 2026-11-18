import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// MUI RadioGroup gives account choices their native keyboard behaviour.
import { Controller } from "react-hook-form";
import {
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/auth/FormField";
import PasswordField from "../../components/auth/PasswordField";
import Button from "../../components/ui/Button";
import { signupSchema } from "../../validation/authSchemas";
import { authService } from "../../services/authService";
import { getApiError } from "../../utils/apiError";
import { showError } from "../../utils/alerts";
import { saveVerification } from "../../utils/verificationStorage";
export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_name: "job_seeker",
    },
  });
  async function submit(values) {
    try {
      await authService.signup(values);
      saveVerification(values.email, true);
      navigate("/verify-email", { state: { sent: true } });
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  return (
    <AuthLayout
      eyebrow="YOUR NEXT CHAPTER"
      title={
        <>
          A little ambition.
          <br />A lot of possibility.
        </>
      }
      description="Create your account. Start with what brings you here."
    >
      <form noValidate onSubmit={handleSubmit(submit)}>
        <FormField
          name="full_name"
          register={register}
          errors={errors}
          label="Full name"
          autoComplete="name"
        />
        <FormField
          name="email"
          register={register}
          errors={errors}
          label="Email address"
          type="email"
          autoComplete="email"
        />
        <FormControl error={!!errors.role_name}>
          <FormLabel id="account-type-label">I'm here to</FormLabel>
          <Controller
            name="role_name"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby="account-type-label"
                className="role-options"
              >
                {[
                  ["job_seeker", "Find opportunities"],
                  ["employer", "Build a team"],
                  ["trainer", "Share knowledge"],
                ].map(([value, label]) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <FormHelperText>{errors.role_name?.message}</FormHelperText>
        </FormControl>
        <PasswordField
          name="password"
          register={register}
          errors={errors}
          label="Create password"
          autoComplete="new-password"
        />
        <PasswordField
          name="confirmPassword"
          register={register}
          errors={errors}
          label="Confirm password"
          autoComplete="new-password"
        />
        <p className="form-hint">
          Use at least 8 characters. We’ll email you a verification code.
        </p>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating your account…" : "Start something good →"}
        </Button>
      </form>
      <p className="auth-footnote">
        Already have an account? <Link to="/login">Sign in ↗</Link>
      </p>
    </AuthLayout>
  );
}
