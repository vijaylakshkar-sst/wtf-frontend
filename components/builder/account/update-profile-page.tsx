"use client";

import { useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { MailIcon, PhoneIcon, UserIcon } from "@/components/icons";

export function UpdateProfilePage() {
  const [notice, setNotice] = useState("Profile details ready.");

  return (
    <BuilderShell>
      <section className="builder-main account-main">
        <header className="account-page-header">
          <div><h1>Update profile</h1><p>Keep your builder account contact details up to date.</p></div>
        </header>
        <form className="account-card" onSubmit={(event) => { event.preventDefault(); setNotice("Profile updated successfully."); }}>
          <div className="account-avatar-row">
            <span>JS</span>
            <div><strong>Jane Smith</strong><small>Builder account</small></div>
            <button type="button" onClick={() => setNotice("Avatar upload opened.")}>Change avatar</button>
          </div>
          <div className="account-form-grid">
            <AccountField icon={<UserIcon size={18} />} label="Full name"><input defaultValue="Jane Smith" /></AccountField>
            <AccountField icon={<MailIcon size={18} />} label="Email address"><input defaultValue="jane@acmehomes.com.au" type="email" /></AccountField>
            <AccountField icon={<PhoneIcon size={18} />} label="Mobile number"><input defaultValue="+61 412 345 678" /></AccountField>
            <AccountField icon={<UserIcon size={18} />} label="Role"><input defaultValue="Sales consultant" /></AccountField>
            <AccountField className="wide" icon={<UserIcon size={18} />} label="Company"><input defaultValue="Acme Homes" /></AccountField>
          </div>
          <footer><button type="submit">Save profile</button></footer>
        </form>
        <p className="account-notice" role="status">{notice}</p>
      </section>
    </BuilderShell>
  );
}

function AccountField({ children, className = "", icon, label }: { children: React.ReactNode; className?: string; icon: React.ReactNode; label: string }) {
  return <label className={`account-field ${className}`}><span>{label}</span><div>{icon}{children}</div></label>;
}
