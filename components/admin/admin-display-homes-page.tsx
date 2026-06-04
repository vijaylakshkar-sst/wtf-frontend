import { AdminShell } from "@/components/admin/admin-shell";
import { ChartIcon, EyeIcon, HomeIcon, SearchIcon, ShieldIcon, UsersIcon } from "@/components/icons";

const displayHomeStats = [
  { label: "Total display homes", value: "86", note: "42 active builders", icon: HomeIcon },
  { label: "Pending review", value: "11", note: "Status checks required", icon: ShieldIcon },
  { label: "Monthly visits", value: "12.4k", note: "+18% this month", icon: UsersIcon },
  { label: "Analytics alerts", value: "7", note: "Low engagement rooms", icon: ChartIcon },
] as const;

const displayHomeActions = [
  { title: "View display homes", copy: "Open builder display home details, rooms, product placements and visitor-facing content.", icon: EyeIcon },
  { title: "Manage display home status", copy: "Change homes between draft, under review, published, paused or archived states.", icon: ShieldIcon },
  { title: "Monitor activity", copy: "Track customer visits, saved products, QR scans, enquiries and recent builder updates.", icon: UsersIcon },
  { title: "Review analytics", copy: "Review performance by display home, room engagement, product interactions and conversion signals.", icon: ChartIcon },
] as const;

const displayHomes = [
  { name: "Brighton Grand Display", builder: "Metricon Homes", location: "Brighton, VIC", rooms: "9", activity: "1,240 visits", analytics: "High", status: "Published" },
  { name: "Parramatta Estate", builder: "Clarendon Homes", location: "Parramatta, NSW", rooms: "7", activity: "860 visits", analytics: "Medium", status: "Review" },
  { name: "Geelong Coastal Home", builder: "Henley Homes", location: "Geelong, VIC", rooms: "8", activity: "620 visits", analytics: "High", status: "Published" },
  { name: "Noosa Retreat", builder: "Masterton Homes", location: "Noosa, QLD", rooms: "6", activity: "240 visits", analytics: "Low", status: "Paused" },
] as const;

export function AdminDisplayHomesPage() {
  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Display homes management</p>
            <h1>Display homes</h1>
            <span>Manage builder display homes, publishing status, customer activity and performance analytics.</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input aria-label="Search display homes" placeholder="Search display homes..." />
          </label>
        </header>

        <section className="admin-stats" aria-label="Display home management metrics">
          {displayHomeStats.map(({ icon: Icon, ...stat }) => (
            <article key={stat.label}>
              <span><Icon size={22} /></span>
              <div>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
                <em>{stat.note}</em>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-panel admin-customer-controls admin-display-home-controls">
          <header>
            <div><h2>Display home controls</h2><p>Admin tools available for display home review, status management, monitoring and analytics.</p></div>
          </header>
          <div>
            {displayHomeActions.map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <Icon size={18} />
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-list-panel admin-display-home-table">
          <header>
            <div><h2>Display home listing</h2><p>Admin overview of builder display homes, status and engagement signals.</p></div>
            <button type="button">Export</button>
          </header>
          <div className="admin-table">
            <div className="admin-row display-home-row admin-row-head"><span>Display home</span><span>Builder</span><span>Location</span><span>Rooms</span><span>Activity</span><span>Analytics</span><span>Status</span><span>Actions</span></div>
            {displayHomes.map((home) => (
              <div className="admin-row display-home-row" key={home.name}>
                <strong><i>{home.name.slice(0, 2).toUpperCase()}</i><span>{home.name}<small>Display home</small></span></strong>
                <span>{home.builder}</span>
                <span>{home.location}</span>
                <span>{home.rooms}</span>
                <span>{home.activity}</span>
                <span>{home.analytics}</span>
                <em className={home.status.toLowerCase()}>{home.status}</em>
                <div className="admin-user-actions">
                  <button aria-label={`View ${home.name}`} title="View display home" type="button"><EyeIcon size={16} /></button>
                  <button aria-label={`Manage ${home.name} status`} title="Manage status" type="button"><ShieldIcon size={16} /></button>
                  <button aria-label={`Monitor ${home.name} activity`} title="Monitor activity" type="button"><UsersIcon size={16} /></button>
                  <button aria-label={`Review ${home.name} analytics`} title="Review analytics" type="button"><ChartIcon size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
