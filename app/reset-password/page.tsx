import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your WTF? account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="reset-password-title">
        <header className="auth-header">
          <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
          <Link className="auth-close" href="/" aria-label="Close reset password modal">&times;</Link>
        </header>
        <h1 id="reset-password-title">Reset password</h1>
        <p className="auth-subtitle">Create a new password for your account.</p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
