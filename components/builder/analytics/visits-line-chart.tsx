import type { AnalyticsYear, VisitPoint } from "@/components/builder/analytics/data";

const maxValue = 300;
const chartWidth = 760;
const chartHeight = 230;
const padding = 28;

export function VisitsLineChart({ selectedYear, visits }: { selectedYear: AnalyticsYear; visits: VisitPoint[] }) {
  const points = visits.map((point, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (visits.length - 1);
    const y = chartHeight - padding - (point.value / maxValue) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const labelInterval = selectedYear === "2026" ? 2 : 1;

  return (
    <section className="analytics-card analytics-chart-card">
      <header>
        <h2>Visits by day</h2>
        <button type="button">Visits <span>v</span></button>
      </header>
      <div className="analytics-line-chart">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`Visits chart for ${selectedYear}`}>
          {[0, 100, 200, 300].map((tick) => {
            const y = chartHeight - padding - (tick / maxValue) * (chartHeight - padding * 2);
            return <g key={tick}><line x1={padding} x2={chartWidth - padding} y1={y} y2={y} /><text x={0} y={y + 4}>{tick}</text></g>;
          })}
          <polyline points={points} />
        </svg>
        <div className="analytics-chart-days">
          {visits.filter((_, index) => index % labelInterval === 0).map((point) => <span key={point.label}>{point.label}</span>)}
        </div>
      </div>
    </section>
  );
}
