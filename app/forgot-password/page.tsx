import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a reset password link for your WTF? account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="forgot-password-title">
        <header className="auth-header">
          <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
          <Link className="auth-close" href="/" aria-label="Close forgot password modal">&times;</Link>
        </header>
        <h1 id="forgot-password-title">Forgot password</h1>
        <p className="auth-subtitle">Enter your email and we will send you a reset password link.</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
