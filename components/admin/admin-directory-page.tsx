"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminDirectories, adminDirectoryMeta, type AdminDirectoryType } from "@/components/admin/data";
import { BoxIcon, ChartIcon, CheckIcon, EyeIcon, KeyIcon, LockIcon, SearchIcon, TrashIcon, UsersIcon, XIcon } from "@/components/icons";

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
            <div className={`admin-row admin-row-head${type === "customers" ? " customer-actions" : ""}${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`}><span>Name</span><span>Primary</span><span>Location</span><span>Metric</span><span>Status</span><span>Updated</span><span>Action</span></div>
            {filteredRows.map((row) => (
              <div className={`admin-row${type === "customers" ? " customer-actions" : ""}${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`} key={row.id}>
                <strong><i>{row.name.slice(0, 2).toUpperCase()}</i><span>{row.name}<small>{row.id}</small></span></strong>
                <span>{row.primary}<small>{row.secondary}</small></span>
                <span>{row.location}</span>
                <span>{row.metricValue}<small>{row.metricLabel}</small></span>
                <em className={row.status.toLowerCase()}>{row.status}</em>
                <span>{row.updated}</span>
                {type === "suppliers" ? (
                  <div className="admin-user-actions" aria-label={`${row.name} supplier actions`}>
                    <button aria-label={`Approve ${row.name}`} title="Approve supplier" type="button"><CheckIcon size={16} /></button>
                    <button aria-label={`Manage ${row.name} products`} title="Manage products" type="button"><BoxIcon size={16} /></button>
                    <button aria-label={`Monitor ${row.name} affiliate tracking`} title="Monitor affiliate tracking" type="button"><KeyIcon size={16} /></button>
                    <button aria-label={`Review ${row.name} analytics`} title="Review supplier analytics" type="button"><ChartIcon size={16} /></button>
                  </div>
                ) : type === "builders" ? (
                  <div className="admin-user-actions" aria-label={`${row.name} builder actions`}>
                    <button aria-label={`Approve ${row.name}`} title="Approve builder" type="button"><CheckIcon size={16} /></button>
                    <button aria-label={`Reject ${row.name}`} className="danger" title="Reject builder" type="button"><XIcon size={16} /></button>
                    <button aria-label={`Verify ${row.name} licenses`} title="Verify licenses" type="button"><KeyIcon size={16} /></button>
                    <button aria-label={`Monitor ${row.name} activity`} title="Monitor builder activity" type="button"><EyeIcon size={16} /></button>
                  </div>
                ) : type === "customers" ? (
                  <div className="admin-user-actions" aria-label={`${row.name} user actions`}>
                    <button aria-label={`View ${row.name}`} title="View user" type="button"><EyeIcon size={16} /></button>
                    <button aria-label={`Suspend ${row.name}`} title="Suspend user" type="button"><XIcon size={16} /></button>
                    <button aria-label={`Block ${row.name}`} title="Block user" type="button"><LockIcon size={16} /></button>
                    <button aria-label={`View ${row.name} activity`} title="View user activity" type="button"><UsersIcon size={16} /></button>
                    <button aria-label={`Delete ${row.name}`} className="danger" title="Delete user" type="button"><TrashIcon size={16} /></button>
                  </div>
                ) : (
                  <button aria-label={`View ${row.name}`} type="button"><EyeIcon size={16} /></button>
                )}
              </div>
            ))}
          </div>
        </section>

        {type === "customers" ? (
          <section className="admin-panel admin-customer-controls">
            <header>
              <div><h2>Customer user controls</h2><p>Actions available for customer account moderation and audit review.</p></div>
            </header>
            <div>
              <article><EyeIcon size={18} /><strong>View users</strong><span>Open profile, contact details, saved products and visit history.</span></article>
              <article><XIcon size={18} /><strong>Suspend users</strong><span>Temporarily disable login while keeping the account data available.</span></article>
              <article><TrashIcon size={18} /><strong>Delete users</strong><span>Remove customer records after admin confirmation and audit checks.</span></article>
              <article><LockIcon size={18} /><strong>Block users</strong><span>Prevent access for flagged or restricted customer accounts.</span></article>
              <article><UsersIcon size={18} /><strong>View user activity</strong><span>Review visits, saves, favourites, enquiries and recent actions.</span></article>
            </div>
          </section>
        ) : null}

        {type === "builders" ? (
          <section className="admin-panel admin-customer-controls">
            <header>
              <div><h2>Builder approval controls</h2><p>Actions available for builder onboarding, license checks and platform monitoring.</p></div>
            </header>
            <div>
              <article><CheckIcon size={18} /><strong>Approve builders</strong><span>Activate reviewed builder accounts and allow access to dashboard features.</span></article>
              <article><XIcon size={18} /><strong>Reject builders</strong><span>Decline incomplete or invalid applications with internal review notes.</span></article>
              <article><KeyIcon size={18} /><strong>Verify licenses</strong><span>Check builder license details, expiry dates and compliance documents.</span></article>
              <article><EyeIcon size={18} /><strong>Monitor builder activity</strong><span>Review display homes, product usage, leads and recent account actions.</span></article>
            </div>
          </section>
        ) : null}

        {type === "suppliers" ? (
          <section className="admin-panel admin-customer-controls">
            <header>
              <div><h2>Supplier management controls</h2><p>Actions available for supplier onboarding, catalogue governance and performance review.</p></div>
            </header>
            <div>
              <article><CheckIcon size={18} /><strong>Approve suppliers</strong><span>Activate reviewed supplier accounts after verification is complete.</span></article>
              <article><BoxIcon size={18} /><strong>Manage products</strong><span>Review supplier product catalogue, uploads, inventory and approval status.</span></article>
              <article><KeyIcon size={18} /><strong>Monitor affiliate tracking</strong><span>Track product attribution, builder usage and affiliate performance signals.</span></article>
              <article><ChartIcon size={18} /><strong>Review supplier analytics</strong><span>Open engagement, saves, visibility and customer interest analytics.</span></article>
            </div>
          </section>
        ) : null}
      </section>
    </AdminShell>
  );
}
