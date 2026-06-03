import { BoxIcon, CheckIcon, ClockIcon, FlagIcon } from "@/components/icons";
import type { productStats } from "@/components/builder/products/data";

const icons = { gold: BoxIcon, green: CheckIcon, amber: ClockIcon, red: FlagIcon };

export function MetricCard({ stat }: { stat: (typeof productStats)[number] }) {
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
