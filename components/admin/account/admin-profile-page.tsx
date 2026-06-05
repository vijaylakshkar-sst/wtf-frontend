"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { MailIcon, PhoneIcon, UserIcon } from "@/components/icons";
import {
  authApi,
  getErrorMessage,
  getStoredAuthUser,
  updateStoredAuthUser,
  type AuthUser,
  type UpdateProfilePayload,
} from "@/lib/api";

const getInitials = (user: AuthUser | null) =>
  `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || "D"}`.toUpperCase();

const getProfileForm = (user: AuthUser | null): UpdateProfilePayload => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  phone: user?.phone || "",
});

export function AdminProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [form, setForm] = useState<UpdateProfilePayload>(() => getProfileForm(getStoredAuthUser()));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const syncUser = async () => {
      try {
        const response = await authApi.me();

        if (isCurrent) {
          setUser(response.data.user);
          setForm(getProfileForm(response.data.user));
          updateStoredAuthUser(response.data.user);
        }
      } catch (syncError) {
        if (isCurrent) {
          setError(getErrorMessage(syncError));
        }
      }
    };

    syncUser();

    return () => {
      isCurrent = false;
    };
  }, []);

  const fullName = useMemo(
    () => [form.firstName, form.lastName].filter(Boolean).join(" ") || "Admin",
    [form.firstName, form.lastName]
  );

  const updateField = (field: keyof UpdateProfilePayload, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await authApi.updateProfile(form);
      setUser(response.data.user);
      updateStoredAuthUser(response.data.user);
      setNotice("Profile updated successfully.");
    } catch (profileError) {
      setError(getErrorMessage(profileError));
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
            <h1>Update profile</h1>
            <span>Keep your platform account contact details current.</span>
          </div>
        </header>

        <form className="admin-account-card" onSubmit={saveProfile}>
          <div className="account-avatar-row">
            <span>{getInitials(user)}</span>
            <div><strong>{fullName}</strong><small>Platform account</small></div>
          </div>
          <div className="account-form-grid">
            <AccountField icon={<UserIcon size={18} />} label="First name">
              <input onChange={(event) => updateField("firstName", event.target.value)} required value={form.firstName} />
            </AccountField>
            <AccountField icon={<UserIcon size={18} />} label="Last name">
              <input onChange={(event) => updateField("lastName", event.target.value)} value={form.lastName || ""} />
            </AccountField>
            <AccountField icon={<MailIcon size={18} />} label="Email address">
              <input onChange={(event) => updateField("email", event.target.value)} required type="email" value={form.email} />
            </AccountField>
            <AccountField icon={<PhoneIcon size={18} />} label="Phone number">
              <input onChange={(event) => updateField("phone", event.target.value)} value={form.phone || ""} />
            </AccountField>
          </div>
          <footer><button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save profile"}</button></footer>
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
