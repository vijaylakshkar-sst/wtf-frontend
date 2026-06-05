"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon } from "@/components/icons";
import {
  authApi,
  getErrorMessage,
  getInactiveAccountMessage,
  getRedirectPathForRoles,
  saveAuthSession,
  validateLogin,
  type LoginForm,
} from "@/lib/api";

type LoginErrors = Partial<Record<keyof LoginForm | "form", string>>;

const initialForm: LoginForm = {
  email: "",
  password: "",
  rememberMe: false,
};

export function SignInForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: keyof LoginForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const submitLogin = async () => {
    const validationErrors = validateLogin(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authApi.login(form);
      const { user } = response.data;

      if (user.status !== "active") {
        setErrors({ form: getInactiveAccountMessage(user.status) });
        return;
      }

      saveAuthSession(response.data, form.rememberMe);
      const roles = user.roles?.map((role) => role.name) || [];
      router.push(getRedirectPathForRoles(roles));
    } catch (error) {
      setErrors({ form: getErrorMessage(error, "Unable to sign in. Please try again.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submitLogin();
      }}
    >
      {errors.form ? <p className="auth-error" role="alert">{errors.form}</p> : null}

      <label>
        Email address
        <span className="auth-input">
          <MailIcon size={17} />
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter your email address"
            type="email"
            value={form.email}
          />
        </span>
        <small className="auth-field-error">{errors.email}</small>
      </label>

      <div className="auth-field">
        <span className="auth-label-row">
          <span>Password</span>
          <button
            className="auth-link-button"
            onClick={() => {
              router.push("/forgot-password");
            }}
            type="button"
          >
            Forgot password?
          </button>
        </span>
        <label className="auth-input">
          <LockIcon size={17} />
          <input
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={form.password}
          />
        </label>
        <small className="auth-field-error">{errors.password}</small>
      </div>

      <label className="auth-remember">
        <input
          checked={form.rememberMe}
          onChange={(event) => updateField("rememberMe", event.target.checked)}
          type="checkbox"
        />
        Remember me
      </label>

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        <LockIcon size={17} /> {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
