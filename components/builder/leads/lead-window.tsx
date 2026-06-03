import type { ReactNode } from "react";

export function LeadWindow({ children, path }: { children: ReactNode; path: string }) {
  return (
    <section className="lead-window" data-path={path}>
      {children}
    </section>
  );
}
