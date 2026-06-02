import type { ReactNode } from "react";
import { BuilderHeader } from "@/components/builder/builder-header";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";

export function BuilderShell({ children }: { children: ReactNode }) {
  return (
    <main className="builder-dashboard">
      <BuilderHeader />
      <BuilderSidebar />
      {children}
    </main>
  );
}
