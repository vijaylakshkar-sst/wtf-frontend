"use client";

import { useState } from "react";
import Link from "next/link";
import { BellIcon, KeyIcon, LogoutIcon, MaximizeIcon, MenuIcon, MinimizeIcon, UserIcon } from "@/components/icons";

type BuilderHeaderProps = {
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  onFullscreenToggle: () => void;
  onSidebarToggle: () => void;
};

export function BuilderHeader({ isFullscreen, isSidebarOpen, onFullscreenToggle, onSidebarToggle }: BuilderHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="builder-topbar">
      <div className="builder-topbar-left">
        <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
        <button className="icon-button builder-menu-toggle" aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"} aria-pressed={isSidebarOpen} onClick={onSidebarToggle} type="button"><MenuIcon /></button>
      </div>
      <div className="builder-topbar-actions">
        <button className="icon-button" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} aria-pressed={isFullscreen} onClick={onFullscreenToggle} type="button">
          {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
        </button>
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
              <Link href="/builder/profile"><UserIcon size={17} /> Update profile</Link>
              <Link href="/builder/change-password"><KeyIcon size={17} /> Change password</Link>
              <Link href="/sign-in"><LogoutIcon size={17} /> Logout</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
