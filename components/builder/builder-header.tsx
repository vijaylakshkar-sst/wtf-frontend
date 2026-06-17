"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { BellIcon, KeyIcon, MaximizeIcon, MenuIcon, MinimizeIcon, UserIcon } from "@/components/icons";
import { getStoredAuthUser } from "@/lib/api";

type BuilderHeaderProps = {
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  onFullscreenToggle: () => void;
  onSidebarToggle: () => void;
};

export function BuilderHeader({ isFullscreen, isSidebarOpen, onFullscreenToggle, onSidebarToggle }: BuilderHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = getStoredAuthUser();

  const displayName = useMemo(() => {
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    return name || user?.email || "Builder";
  }, [user?.email, user?.firstName, user?.lastName]);

  const companyName = useMemo(() => {
    return user?.builderProfile?.companyName || user?.builderMembership?.companyName || "Builder account";
  }, [user?.builderMembership?.companyName, user?.builderProfile?.companyName]);

  const initials = useMemo(() => {
    const source = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || displayName;
    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName, user?.firstName, user?.lastName]);

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
            <span className="profile-avatar">{initials}</span>
            <span className="profile-copy"><strong>{displayName}</strong><small>{companyName}</small></span>
            <span className="profile-chevron">{isProfileOpen ? "\u2303" : "\u2304"}</span>
          </button>
          {isProfileOpen && (
            <div className="profile-drawer">
              <div className="profile-drawer-heading"><strong>{displayName}</strong><small>{companyName}</small></div>
              <Link href="/builder/profile"><UserIcon size={17} /> Update profile</Link>
              <Link href="/builder/change-password"><KeyIcon size={17} /> Change password</Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

