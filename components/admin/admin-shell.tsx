"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;

    return !window.matchMedia("(max-width: 800px)").matches;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));

    syncFullscreen();
    document.addEventListener("fullscreenchange", syncFullscreen);

    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenEnabled) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  return (
    <main className={`builder-dashboard admin-dashboard${isSidebarOpen ? "" : " sidebar-collapsed"}`}>
      <AdminHeader
        isFullscreen={isFullscreen}
        isSidebarOpen={isSidebarOpen}
        onFullscreenToggle={toggleFullscreen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <AdminSidebar isOpen={isSidebarOpen} />
      {children}
    </main>
  );
}
