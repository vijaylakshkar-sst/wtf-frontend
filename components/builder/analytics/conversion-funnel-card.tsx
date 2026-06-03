import type { FunnelRow } from "@/components/builder/analytics/data";

export function ConversionFunnelCard({ rows }: { rows: FunnelRow[] }) {
  return (
    <section className="analytics-card analytics-funnel-card">
      <h2>Lead conversion funnel</h2>
      <div className="analytics-funnel-list">
        {rows.map((row) => (
          <article key={row.label}>
            <p><span>{row.label}</span><strong>{row.value}</strong></p>
            <i><b className={row.tone} style={{ width: `${row.width}%` }} /></i>
          </article>
        ))}
      </div>
    </section>
  );
}
