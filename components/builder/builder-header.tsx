"use client";

import { useState } from "react";
import Link from "next/link";
import { BellIcon, KeyIcon, LogoutIcon, UserIcon } from "@/components/icons";

export function BuilderHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="builder-topbar">
      <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
      <div className="builder-topbar-actions">
        <button className="icon-button notification-button" aria-label="Notifications"><BellIcon /><span>3</span></button>
        <div className="profile-menu">
          <button className="profile-trigger" aria-expanded={isProfileOpen} onClick={() => setIsProfileOpen((open) => !open)}>
            <span className="profile-avatar">JS</span>
            <span className="profile-copy"><strong>Jane Smith</strong><small>Acme Homes</small></span>
            <span className="profile-chevron">{isProfileOpen ? "\u2303" : "\u2304"}</span>
          </button>
          {isProfileOpen && (
            <div className="profile-drawer">
              <div className="profile-drawer-heading"><strong>Jane Smith</strong><small>Builder account</small></div>
              <button><UserIcon size={17} /> Update profile</button>
              <button><KeyIcon size={17} /> Change password</button>
              <Link href="/sign-in"><LogoutIcon size={17} /> Logout</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
