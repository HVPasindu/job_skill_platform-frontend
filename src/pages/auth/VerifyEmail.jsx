import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/auth/FormField";
import Button from "../../components/ui/Button";
import { otpSchema } from "../../validation/authSchemas";
import { authService } from "../../services/authService";
import {
  clearVerification,
  readVerification,
  saveVerification,
} from "../../utils/verificationStorage";
import { getApiError } from "../../utils/apiError";
import { showError, showSuccess } from "../../utils/alerts";
import useResendCooldown from "../../hooks/useResendCooldown";
export default function VerifyEmail() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(readVerification);
  const [resending, setResending] = useState(false);
  const seconds = useResendCooldown(pending.resendAt || 0);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { email: pending.email || "", otp: "" },
  });
  async function submit(values) {
    try {
      await authService.verifyOtp(values);
      clearVerification();
      await showSuccess(
        "You're verified!",
        "Your email is ready. Sign in to start your journey.",
      );
      navigate("/login", {
        replace: true,
        state: { email: values.email, verified: true },
      });
    } catch (error) {
      await showError(getApiError(error));
    }
  }
  async function resend() {
    if (resending || seconds > 0 || !(await trigger("email"))) return;
    setResending(true);
    try {
      const email = getValues("email").trim();
      await authService.resendOtp(email);
      setPending(saveVerification(email, true));
      setValue("otp", "");
      await showSuccess(
        "Check your inbox",
        "A fresh verification code is on its way. It expires in 10 minutes.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setResending(false);
    }
  }
  return (
    <AuthLayout
      eyebrow="ONE LAST LITTLE STEP"
      title={
        <>
          Check your
          <br />
          <em>inbox.</em>
        </>
      }
      description="Enter the 6-digit code from SkillJob. Your code expires in 10 minutes."
    >
      <form noValidate onSubmit={handleSubmit(submit)}>
        <FormField
          name="email"
          register={register}
          errors={errors}
          label="Email address"
          type="email"
          autoComplete="email"
        />
        <FormField
          name="otp"
          register={register}
          errors={errors}
          label="Verification code"
          autoComplete="one-time-code"
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              maxLength: 6,
              className: "otp-input",
            },
          }}
        />
        <Button type="submit" fullWidth disabled={isSubmitting || resending}>
          {isSubmitting ? "Checking your code…" : "Verify my email →"}
        </Button>
      </form>
      <p className="auth-footnote">No code? Check your spam folder, or</p>
      <button
        type="button"
        className="text-action"
        disabled={seconds > 0 || resending || isSubmitting}
        onClick={resend}
      >
        {resending
          ? "Sending…"
          : seconds > 0
            ? `Resend code in ${seconds}s`
            : "Send a new code ↗"}
      </button>
      <p className="auth-footnote">
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
