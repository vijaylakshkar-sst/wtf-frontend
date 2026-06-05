"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckIcon, KeyIcon, LockIcon } from "@/components/icons";
import { authApi, getErrorMessage } from "@/lib/api";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setError("");
    setNotice("");
  };

  const resetPassword = async () => {
    if (!token) {
      setError("Reset token is missing. Please request a new reset link.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setNotice("");

    try {
      await authApi.resetPassword({
        token,
        password: form.password,
      });
      setNotice("Password reset successfully. Redirecting to sign in...");
      window.setTimeout(() => {
        router.replace("/sign-in");
      }, 900);
    } catch (resetError) {
      setError(getErrorMessage(resetError, "Unable to reset password. Please request a new link."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void resetPassword();
      }}
    >
      {error ? <p className="auth-error" role="alert">{error}</p> : null}

      <label>
        New password
        <span className="auth-input">
          <LockIcon size={17} />
          <input
            autoComplete="new-password"
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Enter new password"
            required
            type="password"
            value={form.password}
          />
        </span>
      </label>

      <label>
        Confirm password
        <span className="auth-input">
          <KeyIcon size={17} />
          <input
            autoComplete="new-password"
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            placeholder="Confirm new password"
            required
            type="password"
            value={form.confirmPassword}
          />
        </span>
      </label>

      {notice ? (
        <p className="auth-success" role="status">
          <CheckIcon size={17} />
          {notice}
        </p>
      ) : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        <LockIcon size={17} /> {isSubmitting ? "Resetting..." : "Reset password"}
      </button>

      <Link className="auth-secondary-link" href="/sign-in">
        Back to sign in
      </Link>
    </form>
  );
}
