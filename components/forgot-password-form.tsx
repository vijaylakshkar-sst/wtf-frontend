"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, MailIcon } from "@/components/icons";
import { authApi, getErrorMessage } from "@/lib/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendResetLink = async () => {
    setIsSubmitting(true);
    setNotice("");
    setError("");
    setResetUrl("");

    try {
      const response = await authApi.forgotPassword({ email: email.trim() });
      setNotice("If this email exists, a reset password link has been sent.");
      setResetUrl(response.data?.resetUrl || "");
    } catch (forgotError) {
      setError(getErrorMessage(forgotError, "Unable to send reset link. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void sendResetLink();
      }}
    >
      {error ? <p className="auth-error" role="alert">{error}</p> : null}

      <label>
        Email address
        <span className="auth-input">
          <MailIcon size={17} />
          <input
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setNotice("");
              setError("");
              setResetUrl("");
            }}
            placeholder="Enter your registered email"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      {notice ? (
        <p className="auth-success" role="status">
          <CheckIcon size={17} />
          {notice}
        </p>
      ) : null}

      {resetUrl ? (
        <Link className="auth-secondary-link auth-dev-link" href={resetUrl}>
          Open development reset link
        </Link>
      ) : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        <MailIcon size={17} /> {isSubmitting ? "Sending..." : "Send reset link"}
      </button>

      <Link className="auth-secondary-link" href="/sign-in">
        Back to sign in
      </Link>
    </form>
  );
}
