import type { ReactNode } from "react";

export function PdfPanel({ action, children, index, subtitle, title }: { action?: ReactNode; children: ReactNode; index: string; subtitle?: string; title: string }) {
  return (
    <section className="product-pdf-panel">
      <header><span>{index}</span><div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>{action}</header>
      {children}
    </section>
  );
}
