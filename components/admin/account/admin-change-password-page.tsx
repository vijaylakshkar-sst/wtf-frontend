"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { KeyIcon, LockIcon } from "@/components/icons";
import { authApi, clearAuthSession, getErrorMessage } from "@/lib/api";

export function AdminChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsSaving(true);

    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setNotice("Password changed successfully. Please sign in again.");
      window.setTimeout(() => {
        clearAuthSession();
        router.replace("/sign-in");
      }, 900);
    } catch (passwordError) {
      setError(getErrorMessage(passwordError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Admin account</p>
            <h1>Change password</h1>
            <span>Update the password used to access your platform account.</span>
          </div>
        </header>

        <form className="admin-account-card compact" onSubmit={changePassword}>
          <div className="account-form-grid single">
            <AccountField icon={<LockIcon size={18} />} label="Current password">
              <input onChange={(event) => updateField("currentPassword", event.target.value)} required type="password" value={form.currentPassword} />
            </AccountField>
            <AccountField icon={<KeyIcon size={18} />} label="New password">
              <input onChange={(event) => updateField("newPassword", event.target.value)} required type="password" value={form.newPassword} />
            </AccountField>
            <AccountField icon={<KeyIcon size={18} />} label="Confirm new password">
              <input onChange={(event) => updateField("confirmPassword", event.target.value)} required type="password" value={form.confirmPassword} />
            </AccountField>
          </div>
          <footer><button disabled={isSaving} type="submit">{isSaving ? "Updating..." : "Update password"}</button></footer>
        </form>

        {notice ? <p className="account-notice" role="status">{notice}</p> : null}
        {error ? <p className="account-error" role="alert">{error}</p> : null}
      </section>
    </AdminShell>
  );
}

function AccountField({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return <label className="account-field"><span>{label}</span><div>{icon}{children}</div></label>;
}
