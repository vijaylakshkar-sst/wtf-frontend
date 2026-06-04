import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminDirectoryMeta, adminRecentActivity, adminStats, type AdminDirectoryType } from "@/components/admin/data";
import { ArrowIcon, SearchIcon } from "@/components/icons";

const directoryLinks: AdminDirectoryType[] = ["builders", "suppliers", "customers"];

export function AdminDashboard() {
  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Admin portal</p>
            <h1>Platform dashboard</h1>
            <span>Manage builders, suppliers and customers from one dedicated admin workspace.</span>
          </div>
          <div className="header-actions"><SearchIcon /></div>
        </header>

        <section className="admin-stats" aria-label="Admin overview metrics">
          {adminStats.map(({ icon: Icon, ...metric }) => (
            <article key={metric.label}>
              <span><Icon size={22} /></span>
              <div>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
                <em>{metric.note}</em>
              </div>
            </article>
          ))}
        </section>

        <section className="admin-directory-grid">
          {directoryLinks.map((type) => {
            const meta = adminDirectoryMeta[type];
            const Icon = meta.icon;

            return (
              <Link href={`/admin/${type}`} key={type}>
                <span><Icon size={22} /></span>
                <div>
                  <h2>{meta.title}</h2>
                  <p>{meta.description}</p>
                  <b>Open listing <ArrowIcon size={15} /></b>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="admin-panel">
          <header>
            <div><h2>Recent platform activity</h2><p>Latest movements across builder, supplier and customer accounts.</p></div>
            <button type="button">View all</button>
          </header>
          <div className="admin-activity-list">
            {adminRecentActivity.map((activity, index) => (
              <article key={activity}>
                <span>{index + 1}</span>
                <strong>{activity}</strong>
                <small>{index === 0 ? "Today" : `${index + 1}h ago`}</small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
