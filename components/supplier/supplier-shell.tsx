"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { SupplierSidebar } from "@/components/supplier/supplier-sidebar";

export function SupplierShell({ children }: { children: ReactNode }) {
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
    <main className={`builder-dashboard supplier-admin-dashboard${isSidebarOpen ? "" : " sidebar-collapsed"}`}>
      <SupplierHeader
        isFullscreen={isFullscreen}
        isSidebarOpen={isSidebarOpen}
        onFullscreenToggle={toggleFullscreen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <SupplierSidebar isOpen={isSidebarOpen} />
      {children}
    </main>
  );
}
