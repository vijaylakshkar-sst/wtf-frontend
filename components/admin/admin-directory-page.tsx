"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminDirectories, adminDirectoryMeta, type AdminDirectoryType } from "@/components/admin/data";
import { EyeIcon, SearchIcon } from "@/components/icons";

export function AdminDirectoryPage({ type }: { type: AdminDirectoryType }) {
  const [query, setQuery] = useState("");
  const meta = adminDirectoryMeta[type];
  const rows = adminDirectories[type];
  const Icon = meta.icon;

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;

    return rows.filter((row) => [row.name, row.primary, row.secondary, row.location, row.status].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [query, rows]);

  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>{meta.eyebrow}</p>
            <h1>{meta.title}</h1>
            <span>{meta.description}</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input aria-label={`Search ${meta.title}`} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}...`} value={query} />
          </label>
        </header>

        <section className="admin-list-summary">
          <article><span><Icon size={22} /></span><div><small>Total records</small><strong>{rows.length}</strong></div></article>
          <article><span><Icon size={22} /></span><div><small>Active</small><strong>{rows.filter((row) => row.status === "Active").length}</strong></div></article>
          <article><span><Icon size={22} /></span><div><small>Needs attention</small><strong>{rows.filter((row) => row.status !== "Active").length}</strong></div></article>
        </section>

        <section className="admin-panel admin-list-panel">
          <header>
            <div><h2>{meta.title} listing</h2><p>Admin listing view with account status, owner/contact and platform usage summary.</p></div>
            <button type="button">Export</button>
          </header>
          <div className="admin-table">
            <div className="admin-row admin-row-head"><span>Name</span><span>Primary</span><span>Location</span><span>Metric</span><span>Status</span><span>Updated</span><span>Action</span></div>
            {filteredRows.map((row) => (
              <div className="admin-row" key={row.id}>
                <strong><i>{row.name.slice(0, 2).toUpperCase()}</i><span>{row.name}<small>{row.id}</small></span></strong>
                <span>{row.primary}<small>{row.secondary}</small></span>
                <span>{row.location}</span>
                <span>{row.metricValue}<small>{row.metricLabel}</small></span>
                <em className={row.status.toLowerCase()}>{row.status}</em>
                <span>{row.updated}</span>
                <button aria-label={`View ${row.name}`} type="button"><EyeIcon size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
