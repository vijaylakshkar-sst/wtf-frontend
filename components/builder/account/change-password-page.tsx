"use client";

import { useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { KeyIcon, LockIcon } from "@/components/icons";

export function ChangePasswordPage() {
  const [notice, setNotice] = useState("Use a strong password with at least 8 characters.");

  return (
    <BuilderShell>
      <section className="builder-main account-main">
        <header className="account-page-header">
          <div><h1>Change password</h1><p>Update the password used to access your builder account.</p></div>
        </header>
        <form className="account-card compact" onSubmit={(event) => { event.preventDefault(); setNotice("Password changed successfully."); }}>
          <div className="account-form-grid single">
            <AccountField icon={<LockIcon size={18} />} label="Current password"><input placeholder="Enter current password" required type="password" /></AccountField>
            <AccountField icon={<KeyIcon size={18} />} label="New password"><input placeholder="Enter new password" required type="password" /></AccountField>
            <AccountField icon={<KeyIcon size={18} />} label="Confirm new password"><input placeholder="Confirm new password" required type="password" /></AccountField>
          </div>
          <footer><button type="submit">Update password</button></footer>
        </form>
        <p className="account-notice" role="status">{notice}</p>
      </section>
    </BuilderShell>
  );
}

function AccountField({ children, icon, label }: { children: React.ReactNode; icon: React.ReactNode; label: string }) {
  return <label className="account-field"><span>{label}</span><div>{icon}{children}</div></label>;
}
