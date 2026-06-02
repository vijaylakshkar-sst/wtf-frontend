"use client";

import { useRouter } from "next/navigation";
import { LockIcon, MailIcon } from "@/components/icons";

export function SignInForm() {
  const router = useRouter();

  return (
    <form onSubmit={(event) => { event.preventDefault(); router.push("/builder"); }}>
      <label>
        Email address
        <span className="auth-input">
          <MailIcon size={17} />
          <input autoComplete="email" placeholder="Enter your email address" required type="email" />
        </span>
      </label>
      <label>
        <span className="auth-label-row">
          <span>Password</span>
          <a href="#">Forgot password?</a>
        </span>
        <span className="auth-input">
          <LockIcon size={17} />
          <input autoComplete="current-password" placeholder="Enter your password" required type="password" />
        </span>
      </label>
      <label className="auth-remember">
        <input type="checkbox" />
        Remember me
      </label>
      <button className="auth-submit" type="submit"><LockIcon size={17} /> Sign in</button>
    </form>
  );
}
