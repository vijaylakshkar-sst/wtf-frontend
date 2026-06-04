"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, MailIcon } from "@/components/icons";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setIsSent(true);
      }}
    >
      <label>
        Email address
        <span className="auth-input">
          <MailIcon size={17} />
          <input
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setIsSent(false);
            }}
            placeholder="Enter your registered email"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      {isSent ? (
        <p className="auth-success" role="status">
          <CheckIcon size={17} />
          Reset password link sent to {email}.
        </p>
      ) : null}

      <button className="auth-submit" type="submit">
        <MailIcon size={17} /> Send reset link
      </button>

      <Link className="auth-secondary-link" href="/sign-in">
        Back to sign in
      </Link>
    </form>
  );
}
