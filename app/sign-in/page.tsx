import Link from "next/link";
import { LockIcon, MailIcon } from "@/components/icons";

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
        <form>
          <label>
            Email address
            <span className="auth-input">
              <MailIcon size={17} />
              <input placeholder="Enter your email address" type="email" />
            </span>
          </label>
          <label>
            <span className="auth-label-row">
              <span>Password</span>
              <a href="#">Forgot password?</a>
            </span>
            <span className="auth-input">
              <LockIcon size={17} />
              <input placeholder="Enter your password" type="password" />
            </span>
          </label>
          <label className="auth-remember">
            <input type="checkbox" />
            Remember me
          </label>
          <button className="auth-submit" type="submit"><LockIcon size={17} /> Sign in</button>
        </form>
      </section>
    </main>
  );
}
