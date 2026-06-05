"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AutoDismissNotice } from "@/components/auto-dismiss-notice";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminDirectories, adminDirectoryMeta, type AdminDirectoryRow, type AdminDirectoryType } from "@/components/admin/data";
import { BoxIcon, ChartIcon, CheckIcon, EyeIcon, KeyIcon, LockIcon, SearchIcon, TrashIcon, UsersIcon, XIcon } from "@/components/icons";
import { adminApi, getErrorMessage, type AdminDirectoryPagination, type BuilderApprovalStatus } from "@/lib/api";

const PAGE_SIZE_OPTIONS = [10, 50, 100, 500] as const;

const formatUpdated = (value?: string | null) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

type ConfirmAction = {
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "danger";
  onConfirm: () => Promise<void> | void;
};

const getBuilderStatusLabel = (approvalStatus: BuilderApprovalStatus) => {
  if (approvalStatus === "approved") return "Active";
  if (approvalStatus === "rejected") return "Review";
  if (approvalStatus === "suspended" || approvalStatus === "blocked") return "Inactive";
  return "Pending";
};

const canApproveAccount = (row: AdminDirectoryRow) => row.status !== "Active";
const canRejectAccount = (row: AdminDirectoryRow) => row.status === "Pending";
const canSuspendAccount = (row: AdminDirectoryRow) => row.status === "Active";
const canBlockAccount = (row: AdminDirectoryRow) => row.status !== "Inactive";
const canUseActiveAccountTools = (row: AdminDirectoryRow) => row.status === "Active";

export function AdminDirectoryPage({ type }: { type: AdminDirectoryType }) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<AdminDirectoryRow[]>([]);
  const [pagination, setPagination] = useState<AdminDirectoryPagination | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const meta = adminDirectoryMeta[type];
  const Icon = meta.icon;
  const isApiBackedDirectory = type === "builders" || type === "suppliers";
  const getDetailPath = (row: AdminDirectoryRow) =>
    row.profileId ? `/admin/${type}/${row.profileId}` : `/admin/${type}`;

  useEffect(() => {
    let isCurrent = true;

    if (!isApiBackedDirectory) {
      return;
    }

    const loadDirectory = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response =
          type === "builders"
            ? await adminApi.listBuilders({ page, limit: pageSize, search: query.trim() })
            : await adminApi.listSuppliers({ page, limit: pageSize, search: query.trim() });

        if (!isCurrent) {
          return;
        }

        setRows(
          response.data.rows.map((row) => ({
            ...row,
            profileId: row.id,
            id: row.code || row.id,
            updated: formatUpdated(row.updatedAt || row.updated),
          }))
        );
        setPagination(response.data.pagination);
      } catch (directoryError) {
        if (!isCurrent) {
          return;
        }

        setRows([]);
        setPagination(null);
        setError(getErrorMessage(directoryError));
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadDirectory();

    return () => {
      isCurrent = false;
    };
  }, [isApiBackedDirectory, page, pageSize, query, reloadKey, type]);

  const filteredRows = useMemo(() => {
    const sourceRows = isApiBackedDirectory ? rows : adminDirectories[type];

    if (isApiBackedDirectory) {
      return sourceRows;
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sourceRows;

    return sourceRows.filter((row) => [row.name, row.primary, row.secondary, row.location, row.status].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [isApiBackedDirectory, query, rows, type]);

  const activeCount = filteredRows.filter((row) => row.status === "Active").length;
  const totalRecords = pagination?.total ?? filteredRows.length;

  const getStatusNotice = (name: string, approvalStatus: BuilderApprovalStatus) => {
    if (approvalStatus === "approved") return `${name} approved and activated.`;
    if (approvalStatus === "rejected") return `${name} rejected and suspended.`;
    if (approvalStatus === "suspended") return `${name} suspended.`;
    if (approvalStatus === "blocked") return `${name} blocked.`;
    return `${name} moved to pending.`;
  };

  const updateBuilderStatus = async (row: AdminDirectoryRow, approvalStatus: BuilderApprovalStatus) => {
    if (!row.profileId) {
      setError("Builder profile id is missing. Please refresh and try again.");
      return;
    }

    const response = await adminApi.updateBuilderApprovalStatus(row.profileId, approvalStatus);
    const updatedBuilder = response.data.builder;

    setRows((currentRows) =>
      currentRows.map((currentRow) =>
        currentRow.profileId === row.profileId
          ? {
              ...currentRow,
              status: getBuilderStatusLabel(approvalStatus),
              updated: formatUpdated(updatedBuilder.updatedAt || updatedBuilder.updated),
            }
          : currentRow
      )
    );
    setNotice(getStatusNotice(row.name, approvalStatus));
    setReloadKey((currentKey) => currentKey + 1);
  };

  const updateSupplierStatus = async (row: AdminDirectoryRow, approvalStatus: BuilderApprovalStatus) => {
    if (!row.profileId) {
      setError("Supplier profile id is missing. Please refresh and try again.");
      return;
    }

    const response = await adminApi.updateSupplierApprovalStatus(row.profileId, approvalStatus);
    const updatedSupplier = response.data.supplier;

    setRows((currentRows) =>
      currentRows.map((currentRow) =>
        currentRow.profileId === row.profileId
          ? {
              ...currentRow,
              status: getBuilderStatusLabel(approvalStatus),
              updated: formatUpdated(updatedSupplier.updatedAt || updatedSupplier.updated),
            }
          : currentRow
      )
    );
    setNotice(getStatusNotice(row.name, approvalStatus));
    setReloadKey((currentKey) => currentKey + 1);
  };

  const getStatusConfirmCopy = (entity: "builder" | "supplier", row: AdminDirectoryRow, approvalStatus: BuilderApprovalStatus) => {
    if (approvalStatus === "approved") {
      return {
        title: `Approve ${entity}`,
        message: `Approve ${row.name}? This will activate the ${entity} account and allow dashboard access.`,
        confirmLabel: `Approve ${entity}`,
      };
    }

    if (approvalStatus === "rejected") {
      return {
        title: `Reject ${entity}`,
        message: `Reject ${row.name}? This will suspend the account and prevent sign in.`,
        confirmLabel: `Reject ${entity}`,
        variant: "danger" as const,
      };
    }

    if (approvalStatus === "blocked") {
      return {
        title: `Block ${entity}`,
        message: `Block ${row.name}? This will prevent access until an admin reactivates the account.`,
        confirmLabel: `Block ${entity}`,
        variant: "danger" as const,
      };
    }

    return {
      title: `Suspend ${entity}`,
      message: `Suspend ${row.name}? This will temporarily prevent sign in while keeping account data available.`,
      confirmLabel: `Suspend ${entity}`,
      variant: "danger" as const,
    };
  };

  const openAccountStatusConfirm = (entity: "builder" | "supplier", row: AdminDirectoryRow, approvalStatus: BuilderApprovalStatus) => {
    const copy = getStatusConfirmCopy(entity, row, approvalStatus);

    setConfirmAction({
      ...copy,
      onConfirm: () =>
        entity === "builder"
          ? updateBuilderStatus(row, approvalStatus)
          : updateSupplierStatus(row, approvalStatus),
    });
  };

  const openBuilderInfoConfirm = (row: AdminDirectoryRow, action: "license" | "monitor") => {
    setConfirmAction({
      title: action === "license" ? "Verify licenses" : "Monitor activity",
      message:
        action === "license"
          ? `Open license verification workflow for ${row.name}?`
          : `Open activity monitoring for ${row.name}?`,
      confirmLabel: action === "license" ? "Verify licenses" : "Monitor activity",
      onConfirm: () => {
        setNotice(
          action === "license"
            ? `${row.name} marked for license verification.`
            : `${row.name} activity monitoring opened.`
        );
      },
    });
  };

  const confirmSelectedAction = async () => {
    if (!confirmAction) {
      return;
    }

    setIsActionLoading(true);
    setError("");
    setNotice("");

    try {
      await confirmAction.onConfirm();
      setConfirmAction(null);
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setIsActionLoading(false);
    }
  };

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
            <input
              aria-label={`Search ${meta.title}`}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={`Search ${meta.title.toLowerCase()}...`}
              value={query}
            />
          </label>
        </header>

        <section className="admin-list-summary">
          <article><span><Icon size={22} /></span><div><small>Total records</small><strong>{totalRecords}</strong></div></article>
          <article><span><Icon size={22} /></span><div><small>Active on page</small><strong>{activeCount}</strong></div></article>
          <article><span><Icon size={22} /></span><div><small>Needs attention</small><strong>{filteredRows.filter((row) => row.status !== "Active").length}</strong></div></article>
        </section>

        <AutoDismissNotice
          className="admin-action-notice"
          message={notice}
          onDismiss={() => setNotice("")}
        />

        <section className="admin-panel admin-list-panel">
          <header>
            <div>
              <h2>{meta.title} listing</h2>
              <p>{isApiBackedDirectory ? "Live admin listing with account status, owner/contact and profile summary." : "Admin listing view with account status, owner/contact and platform usage summary."}</p>
            </div>
            {pagination ? (
              <div className="admin-pagination-actions">
                <button disabled={page <= 1 || isLoading} onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))} type="button">Prev</button>
                <label>
                  <select
                    aria-label="Records per page"
                    onChange={(event) => {
                      setPageSize(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                      setPage(1);
                    }}
                    value={pageSize}
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <button disabled={page >= pagination.totalPages || isLoading} onClick={() => setPage((currentPage) => currentPage + 1)} type="button">Next</button>
              </div>
            ) : (
              <button type="button">Export</button>
            )}
          </header>
          <div className="admin-table">
            <div className={`admin-row admin-row-head${type === "customers" ? " customer-actions" : ""}${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`}><span>Name</span><span>Primary</span><span>Location</span><span>Metric</span><span>Status</span><span>Updated</span><span>Action</span></div>
            {isLoading ? (
              <div className={`admin-row${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`}>
                <span>Loading {meta.title.toLowerCase()}...</span><span /><span /><span /><span /><span /><span />
              </div>
            ) : error ? (
              <div className={`admin-row${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`}>
                <span>{error}</span><span /><span /><span /><span /><span /><span />
              </div>
            ) : filteredRows.length === 0 ? (
              <div className={`admin-row${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`}>
                <span>No {meta.title.toLowerCase()} found.</span><span /><span /><span /><span /><span /><span />
              </div>
            ) : filteredRows.map((row) => (
              <div className={`admin-row${type === "customers" ? " customer-actions" : ""}${type === "builders" ? " builder-actions" : ""}${type === "suppliers" ? " supplier-actions" : ""}`} key={row.id}>
                <strong><i>{row.name.slice(0, 2).toUpperCase()}</i><span>{row.name}<small>{row.id}</small></span></strong>
                <span>{row.primary}<small>{row.secondary}</small></span>
                <span>{row.location}</span>
                <span>{row.metricValue}<small>{row.metricLabel}</small></span>
                <em className={row.status.toLowerCase()}>{row.status}</em>
                <span>{row.updated}</span>
                {type === "suppliers" ? (
                  <div className="admin-user-actions" aria-label={`${row.name} supplier actions`}>
                    <Link aria-label={`View ${row.name} details`} className="admin-icon-link" href={getDetailPath(row)} title="View details"><EyeIcon size={16} /></Link>
                    {canApproveAccount(row) ? <button aria-label={`Approve ${row.name}`} onClick={() => openAccountStatusConfirm("supplier", row, "approved")} title="Approve supplier" type="button"><CheckIcon size={16} /></button> : null}
                    {canSuspendAccount(row) ? <button aria-label={`Suspend ${row.name}`} className="danger" onClick={() => openAccountStatusConfirm("supplier", row, "suspended")} title="Suspend supplier" type="button"><XIcon size={16} /></button> : null}
                    {canBlockAccount(row) ? <button aria-label={`Block ${row.name}`} className="danger" onClick={() => openAccountStatusConfirm("supplier", row, "blocked")} title="Block supplier" type="button"><LockIcon size={16} /></button> : null}
                    {canUseActiveAccountTools(row) ? <button aria-label={`Manage ${row.name} products`} title="Manage products" type="button"><BoxIcon size={16} /></button> : null}
                    {canUseActiveAccountTools(row) ? <button aria-label={`Monitor ${row.name} affiliate tracking`} title="Monitor affiliate tracking" type="button"><KeyIcon size={16} /></button> : null}
                    {canUseActiveAccountTools(row) ? <button aria-label={`Review ${row.name} analytics`} title="Review supplier analytics" type="button"><ChartIcon size={16} /></button> : null}
                  </div>
                ) : type === "builders" ? (
                  <div className="admin-user-actions" aria-label={`${row.name} builder actions`}>
                    <Link aria-label={`View ${row.name} details`} className="admin-icon-link" href={getDetailPath(row)} title="View details"><EyeIcon size={16} /></Link>
                    {canApproveAccount(row) ? <button aria-label={`Approve ${row.name}`} onClick={() => openAccountStatusConfirm("builder", row, "approved")} title="Approve builder" type="button"><CheckIcon size={16} /></button> : null}
                    {canRejectAccount(row) ? <button aria-label={`Reject ${row.name}`} className="danger" onClick={() => openAccountStatusConfirm("builder", row, "rejected")} title="Reject builder" type="button"><XIcon size={16} /></button> : null}
                    {canSuspendAccount(row) ? <button aria-label={`Suspend ${row.name}`} className="danger" onClick={() => openAccountStatusConfirm("builder", row, "suspended")} title="Suspend builder" type="button"><XIcon size={16} /></button> : null}
                    {canBlockAccount(row) ? <button aria-label={`Block ${row.name}`} className="danger" onClick={() => openAccountStatusConfirm("builder", row, "blocked")} title="Block builder" type="button"><LockIcon size={16} /></button> : null}
                    {canApproveAccount(row) ? <button aria-label={`Verify ${row.name} licenses`} onClick={() => openBuilderInfoConfirm(row, "license")} title="Verify licenses" type="button"><KeyIcon size={16} /></button> : null}
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

        {confirmAction ? (
          <div className="admin-confirm-overlay" role="presentation">
            <section aria-labelledby="admin-confirm-title" aria-modal="true" className="admin-confirm-modal" role="dialog">
              <header>
                <span>{confirmAction.variant === "danger" ? <XIcon size={22} /> : <CheckIcon size={22} />}</span>
                <div>
                  <h2 id="admin-confirm-title">{confirmAction.title}</h2>
                  <p>{confirmAction.message}</p>
                </div>
              </header>
              <footer>
                <button disabled={isActionLoading} onClick={() => setConfirmAction(null)} type="button">Cancel</button>
                <button className={confirmAction.variant === "danger" ? "danger" : ""} disabled={isActionLoading} onClick={confirmSelectedAction} type="button">
                  {isActionLoading ? "Working..." : confirmAction.confirmLabel}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
