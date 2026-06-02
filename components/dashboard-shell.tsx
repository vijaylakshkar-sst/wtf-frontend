import Link from "next/link";
import { BellIcon, BoxIcon, ChartIcon, HomeIcon, SearchIcon, UsersIcon } from "@/components/icons";

const configs = {
  admin: { label: "Admin", greeting: "Platform overview", icon: ChartIcon, cards: ["Active builders", "Supplier partners", "Monthly leads", "Open enquiries"] },
  builder: { label: "Builder", greeting: "Your display homes", icon: HomeIcon, cards: ["Display homes", "Visitor leads", "Saved selections", "New enquiries"] },
  supplier: { label: "Supplier", greeting: "Your product reach", icon: BoxIcon, cards: ["Listed products", "Display homes", "Product saves", "New enquiries"] },
} as const;

export function DashboardShell({ role }: { role: keyof typeof configs }) {
  const config = configs[role];
  const RoleIcon = config.icon;

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <Link className="logo" href="/">wtf?</Link>
        <div className="role-pill"><RoleIcon size={16} /> {config.label}</div>
        <nav aria-label={`${config.label} portal navigation`}>
          <a className="active" href="#"><HomeIcon size={18} /> Overview</a>
          <a href="#"><ChartIcon size={18} /> Analytics</a>
          <a href="#"><UsersIcon size={18} /> Enquiries</a>
          <a href="#"><BoxIcon size={18} /> Resources</a>
        </nav>
        <Link className="back-link" href="/">&larr; Back to website</Link>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div><p>{config.label} portal</p><h1>{config.greeting}</h1></div>
          <div className="header-actions"><SearchIcon /><BellIcon /><span>{config.label.slice(0, 1)}</span></div>
        </header>
        <div className="metric-grid">
          {config.cards.map((card, index) => <article key={card}><p>{card}</p><strong>{[12, 38, 126, 7][index]}</strong><small>+{index + 3}% this month</small></article>)}
        </div>
        <section className="dashboard-panel">
          <div><h2>Recent activity</h2><p>Everything happening in your {config.label.toLowerCase()} workspace.</p></div>
          <button>View all activity</button>
          <div className="empty-state"><RoleIcon size={30} /><h2>Your workspace is ready</h2><p>Start adding content to see recent activity here.</p></div>
        </section>
      </section>
    </main>
  );
}
