import { BookmarkIcon, PhoneIcon, SparklesIcon, UploadIcon } from "@/components/icons";
import type { BehaviourStat } from "@/components/builder/analytics/data";

const behaviourIcons = [BookmarkIcon, SparklesIcon, UploadIcon, PhoneIcon];

export function CustomerBehaviourCard({ stats }: { stats: BehaviourStat[] }) {
  return (
    <section className="analytics-card analytics-behaviour-card">
      <h2>Customer behaviour analytics</h2>
      <div className="analytics-behaviour-grid">
        {stats.map((item, index) => {
          const Icon = behaviourIcons[index] ?? BookmarkIcon;
          return (
            <article key={item.label}>
              <p><span className={item.tone}><Icon size={17} /></span>{item.label}</p>
              <i><b className={item.tone} style={{ width: `${item.width}%` }} /></i>
              <small>{item.value}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
