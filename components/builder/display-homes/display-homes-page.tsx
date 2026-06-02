import { BoxIcon, FilterIcon, HomeIcon, PlusIcon, SearchIcon, UsersIcon } from "@/components/icons";
import { BuilderShell } from "@/components/builder/builder-shell";
import { displayHomes, homeActivity, homeStats } from "@/components/builder/display-homes/data";
import { HomeCard } from "@/components/builder/display-homes/home-card";

const statIcons = [HomeIcon, UsersIcon, UsersIcon, BoxIcon];

export function DisplayHomesPage() {
  return (
    <BuilderShell>
      <section className="builder-main display-homes-main">
        <header className="display-homes-header">
          <div><h1>Display homes</h1><p>4 homes <b>&bull;</b> 3 published <b>&bull;</b> 1 draft</p></div>
          <div className="display-home-tools">
            <label><SearchIcon size={17} /><input placeholder="Search display homes..." /></label>
            <button className="status-filter"><FilterIcon size={15} /> All status <span>&#8964;</span></button>
            <button className="builder-primary"><PlusIcon size={18} /> Create display home</button>
          </div>
        </header>
        <section className="home-stats" aria-label="Display home statistics">
          {homeStats.map((stat, index) => {
            const Icon = statIcons[index];
            return <article key={stat.label}><div className="builder-metric-icon"><Icon size={19} /></div><div><p>{stat.label}</p><strong>{stat.value}</strong><small className={index ? "positive" : ""}>{index ? "\u2191 " : ""}{stat.note}</small></div></article>;
          })}
        </section>
        <section className="homes-grid" aria-label="Display homes list">
          {displayHomes.map((home) => <HomeCard home={home} key={home.name} />)}
        </section>
        <div className="display-bottom-grid">
          <section className="display-bottom-panel activity-list">
            <header><h2>Recent activity</h2><a href="#">View all</a></header>
            {homeActivity.map(([title, subtitle, time], index) => <article key={title}><span>{index + 1}</span><div><strong>{title}</strong><small>{subtitle}</small></div><time>{time}</time></article>)}
          </section>
          <section className="display-bottom-panel top-homes">
            <header><h2>Top performing homes</h2><a href="#">View report</a></header>
            {displayHomes.map((home, index) => <article key={home.name}><b>{index + 1}</b><div className="top-home-thumb" style={{ backgroundImage: `url("${home.image}")`, backgroundPosition: home.position }} /><div><strong>{home.name}</strong><small>{home.address.split(",")[0]}</small></div><span><small>Visits</small>{home.visits}</span><span><small>Leads</small>{home.leads}</span></article>)}
          </section>
        </div>
      </section>
    </BuilderShell>
  );
}
