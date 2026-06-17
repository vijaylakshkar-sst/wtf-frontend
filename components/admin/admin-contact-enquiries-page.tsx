"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminConfirmationModal } from "@/components/admin/admin-confirmation-modal";
import { BellIcon, CheckIcon, EyeIcon, MailIcon, SearchIcon, TrashIcon, UsersIcon, XIcon } from "@/components/icons";
import { useToast } from "@/components/toast-provider";
import {
  adminContactEnquiriesApi,
  getErrorMessage,
  type ContactEnquiry,
  type ContactEnquiryPriority,
  type ContactEnquiryStatus,
  type ContactEnquiryStats,
  type ContactEnquiryType,
} from "@/lib/api";

const PAGE_SIZE_OPTIONS = [50, 100, 500] as const;
const DEFAULT_PAGE_SIZE = 50;
const ENQUIRY_TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Customer", value: "customer" },
  { label: "Supplier", value: "supplier" },
  { label: "Builder", value: "builder" },
  { label: "General", value: "general" },
] as const;
const PRIORITY_OPTIONS = [
  { label: "All priorities", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;
const STATUS_OPTIONS = [
  { label: "All status", value: "" },
  { label: "New", value: "new" },
  { label: "In progress", value: "in_progress" },
  { label: "Closed", value: "closed" },
] as const;

const emptyStats: ContactEnquiryStats = {
  totalCount: 0,
  newCount: 0,
  highPriorityCount: 0,
  closedCount: 0,
  newThisWeekCount: 0,
  resolvedThisMonthCount: 0,
};

const enquiryTypeLabels: Record<ContactEnquiryType, string> = {
  customer: "Customer enquiry",
  supplier: "Supplier enquiry",
  builder: "Builder enquiry",
  general: "General enquiry",
};

const priorityLabels: Record<ContactEnquiryPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const formatRelativeDate = (value?: string) => {
  if (!value) {
    return "Unknown";
  }

  const createdAt = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24) {
    return diffHours === 1 ? "1h ago" : `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
  }).format(createdAt);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type SelectOption = {
  label: string;
  value: string;
};

const CustomSelect = ({
  ariaLabel,
  disabled,
  menuPlacement = "down",
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  ariaLabel: string;
  disabled?: boolean;
  menuPlacement?: "down" | "up";
  name: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  value: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label || "";

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className={`registration-select-wrap admin-custom-select${menuPlacement === "up" ? " admin-custom-select-up" : ""}`} data-open={isOpen} ref={wrapRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="registration-select-trigger"
        data-invalid={false}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className={value ? "" : "placeholder"}>{selectedLabel || placeholder}</span>
        <i />
      </button>
      {isOpen ? (
        <div className="registration-select-menu" role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option.value === value}
              className={option.value === value ? "selected" : ""}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
      <input name={name} type="hidden" value={value} />
    </div>
  );
};

export function AdminContactEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [stats, setStats] = useState<ContactEnquiryStats>(emptyStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ContactEnquiryStatus>("new");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deletingEnquiryId, setDeletingEnquiryId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactEnquiry | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedEnquiry = useMemo(
    () => enquiries.find((enquiry) => enquiry.id === selectedEnquiryId) || null,
    [enquiries, selectedEnquiryId],
  );

  const hasActiveFilters = Boolean(searchQuery || typeFilter || priorityFilter || statusFilter);

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setPriorityFilter("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    setSelectedStatus(selectedEnquiry?.status || "new");
  }, [selectedEnquiry?.id, selectedEnquiry?.status]);

  useEffect(() => {
    let isCurrent = true;

    const loadEnquiries = async () => {
      setIsLoading(true);

      try {
        const response = await adminContactEnquiriesApi.listEnquiries({
          search: searchQuery.trim() || undefined,
          page,
          limit: pageSize,
          type: typeFilter || undefined,
          priority: priorityFilter || undefined,
          status: statusFilter || undefined,
        });

        if (!isCurrent) {
          return;
        }

        setEnquiries(response.data.enquiries);
        setStats(response.data.stats);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.total);

        if (!response.data.enquiries.some((enquiry) => enquiry.id === selectedEnquiryId)) {
          setSelectedEnquiryId(response.data.enquiries[0]?.id || null);
        }
      } catch (error) {
        if (isCurrent) {
          showToast(getErrorMessage(error, "Unable to load contact enquiries."), "error");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    const timer = window.setTimeout(() => {
      void loadEnquiries();
    }, searchQuery ? 220 : 0);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [page, pageSize, priorityFilter, searchQuery, showToast, statusFilter, typeFilter]);

  const openEmail = (enquiry: ContactEnquiry) => {
    window.location.href = `mailto:${enquiry.contactEmail}?subject=${encodeURIComponent(enquiry.subject)}`;
  };

  const deleteEnquiry = async (enquiry: ContactEnquiry) => {
    setDeleteTarget(enquiry);
  };

  const confirmDeleteEnquiry = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingEnquiryId(deleteTarget.id);

    try {
      await adminContactEnquiriesApi.deleteEnquiry(deleteTarget.id);

      if (selectedEnquiryId === deleteTarget.id) {
        setSelectedEnquiryId(null);
        setIsModalOpen(false);
      }

      await refreshCurrentPage();
      showToast("Contact enquiry deleted.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Unable to delete enquiry."), "error");
    } finally {
      setDeletingEnquiryId(null);
      setDeleteTarget(null);
    }
  };

  const openModal = (enquiry: ContactEnquiry) => {
    setSelectedEnquiryId(enquiry.id);
    setSelectedStatus(enquiry.status);
    setIsModalOpen(true);
  };

  const refreshCurrentPage = async () => {
    const response = await adminContactEnquiriesApi.listEnquiries({
      search: searchQuery.trim() || undefined,
      page,
      limit: pageSize,
      type: typeFilter || undefined,
      priority: priorityFilter || undefined,
      status: statusFilter || undefined,
    });

    setEnquiries(response.data.enquiries);
    setStats(response.data.stats);
    setTotalPages(response.data.pagination.totalPages);
    setTotalCount(response.data.pagination.total);

    if (selectedEnquiryId) {
      const nextSelected = response.data.enquiries.find((enquiry) => enquiry.id === selectedEnquiryId) || null;
      setSelectedEnquiryId(nextSelected?.id || null);
      if (nextSelected) {
        setSelectedStatus(nextSelected.status);
      }
    }
  };

  const updateEnquiryStatus = async (enquiryId: string, nextStatus: ContactEnquiryStatus) => {
    setUpdatingStatusId(enquiryId);

    try {
      await adminContactEnquiriesApi.updateStatus(enquiryId, { status: nextStatus });
      await refreshCurrentPage();
      showToast("Contact enquiry status updated.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Unable to update enquiry status."), "error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const saveModalStatus = async () => {
    if (!selectedEnquiry) {
      return;
    }

    setSavingStatus(true);

    try {
      await adminContactEnquiriesApi.updateStatus(selectedEnquiry.id, { status: selectedStatus });
      await refreshCurrentPage();
      showToast("Contact enquiry status updated.", "success");
      setIsModalOpen(false);
    } catch (error) {
      showToast(getErrorMessage(error, "Unable to update enquiry status."), "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const exportCurrentList = async () => {
    setIsExporting(true);

    try {
      const blob = await adminContactEnquiriesApi.exportEnquiries({
        search: searchQuery.trim() || undefined,
        type: typeFilter || undefined,
        priority: priorityFilter || undefined,
        status: statusFilter || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);

      anchor.href = url;
      anchor.download = `contact-enquiries-${today}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);

      showToast("Contact enquiries exported.", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Unable to export contact enquiries."), "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>Contact us enquiries</p>
            <h1>Contact enquiries</h1>
            <span>View and manage enquiries submitted from the Contact Us form.</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input
              aria-label="Search contact enquiries"
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search enquiries..."
              value={searchQuery}
            />
          </label>
        </header>

        <section className="admin-stats" aria-label="Contact enquiry metrics">
          <article>
            <span><MailIcon size={22} /></span>
            <div>
              <small>Total enquiries</small>
              <strong>{stats.totalCount}</strong>
              <em>{stats.newThisWeekCount ? `+${stats.newThisWeekCount} this week` : "No new enquiries this week"}</em>
            </div>
          </article>
          <article>
            <span><UsersIcon size={22} /></span>
            <div>
              <small>New enquiries</small>
              <strong>{stats.newCount}</strong>
              <em>Awaiting response</em>
            </div>
          </article>
          <article>
            <span><BellIcon size={22} /></span>
            <div>
              <small>High priority</small>
              <strong>{stats.highPriorityCount}</strong>
              <em>Needs quick follow-up</em>
            </div>
          </article>
          <article>
            <span><EyeIcon size={22} /></span>
            <div>
              <small>Closed</small>
              <strong>{stats.closedCount}</strong>
              <em>Resolved this month</em>
            </div>
          </article>
        </section>

        <section className="admin-enquiry-filters" aria-label="Contact enquiry filters">
          <label className="admin-enquiry-filter">
            <span>Type</span>
            <CustomSelect
              ariaLabel="Filter by enquiry type"
              name="typeFilter"
              onChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
              options={ENQUIRY_TYPE_OPTIONS}
              placeholder="All types"
              value={typeFilter}
            />
          </label>
          <label className="admin-enquiry-filter">
            <span>Priority</span>
            <CustomSelect
              ariaLabel="Filter by priority"
              name="priorityFilter"
              onChange={(value) => {
                setPriorityFilter(value);
                setPage(1);
              }}
              options={PRIORITY_OPTIONS}
              placeholder="All priorities"
              value={priorityFilter}
            />
          </label>
          <label className="admin-enquiry-filter">
            <span>Status</span>
            <CustomSelect
              ariaLabel="Filter by status"
              name="statusFilter"
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
              placeholder="All status"
              value={statusFilter}
            />
          </label>
          <button
            className="admin-enquiry-reset"
            disabled={!hasActiveFilters}
            onClick={resetFilters}
            type="button"
          >
            Reset filters
          </button>
        </section>

        <section className="admin-panel admin-list-panel admin-contact-enquiries-table">
          <header>
            <div>
              <h2>Enquiry list</h2>
              <p>Contact form submissions with customer details, subject, priority and status.</p>
            </div>
            <button disabled={isExporting} onClick={() => void exportCurrentList()} type="button">
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </header>

          <div className="admin-table">
            <div className="admin-row contact-enquiry-row admin-row-head">
              <span className="admin-srno-cell">S. No.</span>
              <span className="admin-name-cell">Name</span>
              <span className="admin-contact-cell">Contact</span>
              <span className="admin-type-cell">Type</span>
              <span className="admin-subject-cell">Subject</span>
              <span className="admin-priority-cell">Priority</span>
              <span className="admin-status-cell">Status</span>
              <span className="admin-date-cell">Date</span>
              <span className="admin-actions-cell">Actions</span>
            </div>

            {isLoading ? <p className="admin-empty-state">Loading enquiries...</p> : null}
            {!isLoading && enquiries.length === 0 ? <p className="admin-empty-state">No enquiries found.</p> : null}

            {enquiries.map((enquiry, index) => (
              <div className="admin-row contact-enquiry-row" key={enquiry.id}>
                <span className="admin-srno admin-srno-cell">{(page - 1) * pageSize + index + 1}</span>
                <strong className="admin-name-cell">
                  <i>{getInitials(enquiry.contactName)}</i>
                  <span>
                    {enquiry.contactName}
                    <small>{enquiry.referenceCode}</small>
                  </span>
                </strong>
                <span className="admin-contact-cell">
                  {enquiry.contactEmail}
                  <small>{enquiry.contactPhone || "-"}</small>
                </span>
                <span className="admin-type-cell">{enquiryTypeLabels[enquiry.enquiryType]}</span>
                <span className="admin-subject-cell">{enquiry.subject}</span>
                <span className="admin-priority-cell">{priorityLabels[enquiry.priority]}</span>
                <span className="admin-contact-status-cell">
                  <CustomSelect
                    ariaLabel={`Update status for ${enquiry.contactName}`}
                    disabled={updatingStatusId === enquiry.id}
                    name={`status-${enquiry.id}`}
                    onChange={(value) => {
                      void updateEnquiryStatus(enquiry.id, value as ContactEnquiryStatus);
                    }}
                    options={STATUS_OPTIONS.slice(1) as SelectOption[]}
                    placeholder="Update status"
                    value={enquiry.status}
                  />
                </span>
                <span className="admin-date-cell">{formatRelativeDate(enquiry.createdAt)}</span>
                <div className="admin-user-actions admin-actions-cell">
                  <button
                    aria-label={`View enquiry from ${enquiry.contactName}`}
                    onClick={() => openModal(enquiry)}
                    title="View enquiry"
                    type="button"
                  >
                    <EyeIcon size={16} />
                  </button>
                  <button
                    aria-label={`Delete enquiry from ${enquiry.contactName}`}
                    className="danger"
                    disabled={deletingEnquiryId === enquiry.id}
                    onClick={() => void deleteEnquiry(enquiry)}
                    title="Delete enquiry"
                    type="button"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="admin-pagination-actions">
            <label className="admin-page-size">
              <span>Rows</span>
              <CustomSelect
                ariaLabel="Rows per page"
                disabled={isLoading}
                name="rowsPerPage"
                onChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
                options={PAGE_SIZE_OPTIONS.map((option) => ({ label: String(option), value: String(option) }))}
                placeholder={String(DEFAULT_PAGE_SIZE)}
                value={String(pageSize)}
              />
            </label>
            <button disabled={page <= 1 || isLoading} onClick={() => setPage((current) => Math.max(current - 1, 1))} type="button">
              Previous
            </button>
            <button disabled={page >= totalPages || isLoading} onClick={() => setPage((current) => current + 1)} type="button">
              Next
            </button>
          </footer>
        </section>
      </section>

      {isModalOpen && selectedEnquiry ? (
        <div className="admin-confirm-overlay" role="presentation">
          <section aria-modal="true" className="admin-confirm-modal admin-enquiry-modal" role="dialog">
            <header>
              <span><EyeIcon size={24} /></span>
              <div>
                <h2>{selectedEnquiry.contactName}</h2>
                <p>
                  {selectedEnquiry.referenceCode} - {enquiryTypeLabels[selectedEnquiry.enquiryType]}
                </p>
              </div>
              <button aria-label="Close enquiry modal" onClick={() => setIsModalOpen(false)} type="button">
                <XIcon size={22} />
              </button>
            </header>

            <div className="admin-enquiry-modal-body">
              <article>
                <small>Contact</small>
                <strong>{selectedEnquiry.contactEmail}</strong>
                <span>{selectedEnquiry.contactPhone || "No phone number provided"}</span>
              </article>
              <article>
                <small>Priority</small>
                <strong>{priorityLabels[selectedEnquiry.priority]}</strong>
                <span>{formatRelativeDate(selectedEnquiry.createdAt)}</span>
              </article>
              <article className="wide">
                <small>Subject</small>
                <strong>{selectedEnquiry.subject}</strong>
                <span>{selectedEnquiry.message}</span>
              </article>
              <article className="wide">
                <small>Status</small>
                <label className="admin-enquiry-modal-status">
                  <CustomSelect
                    ariaLabel="Update enquiry status"
                    menuPlacement="up"
                    name="modalStatus"
                    onChange={(value) => setSelectedStatus(value as ContactEnquiryStatus)}
                    options={STATUS_OPTIONS.slice(1) as SelectOption[]}
                    placeholder="Select status"
                    value={selectedStatus}
                  />
                </label>
              </article>
            </div>

            <footer>
              <button onClick={() => setIsModalOpen(false)} type="button">Close</button>
              <button disabled={savingStatus} onClick={() => void saveModalStatus()} type="button">
                <CheckIcon size={16} /> {savingStatus ? "Saving..." : "Save status"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      <AdminConfirmationModal
        confirmLabel="Delete enquiry"
        icon={<TrashIcon size={22} />}
        isLoading={deletingEnquiryId !== null}
        message={
          deleteTarget
            ? `Delete enquiry from ${deleteTarget.contactName}? This cannot be undone.`
            : "Delete this enquiry? This cannot be undone."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDeleteEnquiry()}
        open={deleteTarget !== null}
        title="Delete enquiry"
        variant="danger"
      />
    </AdminShell>
  );
}
