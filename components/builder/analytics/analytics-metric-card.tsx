import { CheckIcon, EyeIcon, FilterIcon, UsersIcon } from "@/components/icons";

const metricIcons = [UsersIcon, EyeIcon, FilterIcon, CheckIcon];

type AnalyticsMetricCardProps = {
  change: string;
  iconTone: string;
  index: number;
  label: string;
  value: string;
};

export function AnalyticsMetricCard({ change, iconTone, index, label, value }: AnalyticsMetricCardProps) {
  const Icon = metricIcons[index] ?? UsersIcon;

  return (
    <article className="analytics-metric-card">
      <span className={`analytics-metric-icon ${iconTone}`}><Icon size={23} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>↑ {change} <em>vs previous 20 days</em></small>
      </div>
    </article>
  );
}
