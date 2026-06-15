import { builderMetrics, chartPoints, recentLeads } from "@/components/builder/data";

export function BuilderOverview() {
  return (
    <section className="builder-main">
      <div className="builder-welcome">
        <div><h1>Good morning, Jane</h1><p>Here&apos;s what&apos;s happening with your display homes.</p></div>
      </div>
      <section className="builder-metrics" aria-label="Builder metrics">
        {builderMetrics.map(({ icon: Icon, label, value, change, positive }) => (
          <article key={label}>
            <div className="builder-metric-icon"><Icon size={20} /></div>
            <p>{label}</p><strong>{value}</strong>
            <small className={positive ? "positive" : "negative"}>{positive ? "\u2191" : "\u2193"} {change}</small>
          </article>
        ))}
      </section>
      <div className="builder-content-grid">
        <section className="builder-panel visits-panel">
          <header><h2>Visits this week</h2><button>This week <span aria-hidden="true">&#8964;</span></button></header>
          <div className="chart">
            <div className="chart-guides"><span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div>
            <svg aria-label="Visits chart" preserveAspectRatio="none" role="img" viewBox="0 0 438 160"><polyline fill="none" points={chartPoints} stroke="currentColor" strokeWidth="2" /></svg>
            <div className="chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          </div>
          <div className="visit-summary"><div><small>Total visits</small><strong>312</strong></div><div><small>Avg. visits per day</small><strong>44</strong></div></div>
        </section>
        <section className="builder-panel leads-panel">
          <header><h2>Recent leads</h2><a href="#">View all</a></header>
          <div className="leads-table">
            <div className="lead-row lead-head"><span>Name</span><span>Home</span><span>Status</span><span>Added</span></div>
            {recentLeads.map((lead) => <div className="lead-row" key={lead.name}><span className="lead-name"><b>{lead.initials}</b>{lead.name}</span><span>{lead.home}</span><span><i className={`lead-status ${lead.status.toLowerCase()}`}>{lead.status}</i></span><span>{lead.added}</span></div>)}
          </div>
          <a className="view-leads" href="#">View all leads <span>&rarr;</span></a>
        </section>
      </div>
    </section>
  );
}
