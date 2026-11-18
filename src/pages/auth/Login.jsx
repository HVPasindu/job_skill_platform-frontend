import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// useForm handles fields/submission; yupResolver runs the readable schema rules.
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/auth/FormField";
import PasswordField from "../../components/auth/PasswordField";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { loginSchema } from "../../validation/authSchemas";
import { getApiError } from "../../utils/apiError";
import { showError } from "../../utils/alerts";
import { saveVerification } from "../../utils/verificationStorage";
import { roleHome } from "../../data/roles";
export default function Login() {
  const { login, sessionExpired } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [needsVerification, setNeedsVerification] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: location.state?.email || "", password: "" },
  });
  async function submit(values) {
    setNeedsVerification(false);
    try {
      const session = await login(values);
      const from = location.state?.from;
      // Only restore an internal dashboard destination after sign-in.
      navigate(
        typeof from === "string" && from.startsWith("/dashboard/")
          ? from
          : roleHome(session.activeRole),
        { replace: true },
      );
    } catch (error) {
      setNeedsVerification(
        error.response?.status === 403 &&
          /verify.*email/i.test(error.response?.data?.message || ""),
      );
      await showError(getApiError(error));
    }
  }
  function openVerification() {
    saveVerification(getValues("email").trim());
    navigate("/verify-email");
  }
  return (
    <AuthLayout
      eyebrow="WELCOME BACK"
      title={
        <>
          Ready for
          <br />
          what’s next?
        </>
      }
      description="Sign in and pick up where you left off."
    >
      {sessionExpired && (
        <p role="status" className="form-notice">
          Your session expired. Please sign in again.
        </p>
      )}
      {location.state?.verified && (
        <p role="status" className="form-notice">
          Email verified. You can sign in now.
        </p>
      )}
      <form noValidate onSubmit={handleSubmit(submit)}>
        <FormField
          name="email"
          register={register}
          errors={errors}
          label="Email address"
          autoComplete="email"
          type="email"
        />
        <PasswordField
          name="password"
          register={register}
          errors={errors}
          label="Password"
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Let's go →"}
        </Button>
      </form>
      {needsVerification && (
        <button
          type="button"
          className="text-action"
          onClick={openVerification}
        >
          Verify your email to continue →
        </button>
      )}
      <p className="auth-footnote">
        New around here? <Link to="/signup">Create an account ↗</Link>
      </p>
    </AuthLayout>
  );
}
