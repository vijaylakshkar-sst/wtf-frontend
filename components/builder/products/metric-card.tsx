import { BoxIcon, CheckIcon, ClockIcon, FlagIcon } from "@/components/icons";

const icons = { gold: BoxIcon, green: CheckIcon, amber: ClockIcon, red: FlagIcon };
type ProductMetricStat = { label: string; value: string; note: string; tone: keyof typeof icons };

export function MetricCard({ stat }: { stat: ProductMetricStat }) {
  const Icon = icons[stat.tone];

  return (
    <article className={`product-metric ${stat.tone}`}>
      <span><Icon size={21} /></span>
      <div>
        <small>{stat.label}</small>
        <strong>{stat.value}</strong>
        <em>{stat.note}</em>
      </div>
      <i aria-hidden="true" />
    </article>
  );
}
