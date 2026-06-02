import Link from "next/link";
import type { Metadata } from "next";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your WTF? account.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="sign-in-title">
        <header className="auth-header">
          <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
          <Link className="auth-close" href="/" aria-label="Close sign in modal">&times;</Link>
        </header>
        <h1 id="sign-in-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>
        <SignInForm />
      </section>
    </main>
  );
}
