"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArrowIcon, BoxIcon, HomeIcon, MailIcon, PhoneIcon, UserIcon } from "@/components/icons";
import { adminApi, getErrorMessage, type AdminProfileDetail } from "@/lib/api";

type AdminProfileDetailPageProps = {
  id: string;
  type: "builder" | "supplier";
};

type DetailField = {
  label: string;
  key: string;
};

type DetailSection = {
  title: string;
  fields: DetailField[];
};

const builderSections: DetailSection[] = [
  {
    title: "Company details",
    fields: [
      { label: "Company legal name", key: "companyName" },
      { label: "Trading name", key: "tradingName" },
      { label: "ABN", key: "abn" },
      { label: "License number", key: "licenseNumber" },
      { label: "Years in operation", key: "yearsInOperation" },
      { label: "Display homes", key: "displayHomesCount" },
      { label: "Regions serviced", key: "regionsServiced" },
      { label: "Website", key: "website" },
      { label: "Social media links", key: "socialMediaLinks" },
    ],
  },
  {
    title: "Primary contact",
    fields: [
      { label: "Contact name", key: "primaryContactName" },
      { label: "Position", key: "primaryContactPosition" },
      { label: "Email", key: "primaryContactEmail" },
      { label: "Mobile", key: "primaryContactMobile" },
      { label: "Preferred method", key: "preferredContactMethod" },
    ],
  },
  {
    title: "Business profile",
    fields: [
      { label: "Builder type", key: "builderType" },
      { label: "Homes built per year", key: "homesBuiltPerYear" },
      { label: "Sales consultants", key: "salesConsultantsCount" },
      { label: "Colour consultants", key: "colourConsultantsCount" },
      { label: "Internal marketing team", key: "hasInternalMarketingTeam" },
    ],
  },
  {
    title: "Selections workflow",
    fields: [
      { label: "Colour selection management", key: "colourSelectionManagement" },
      { label: "Clients receive", key: "clientReceives" },
      { label: "Export selections", key: "exportSelections" },
      { label: "Selections sent to", key: "selectionsSentTo" },
      { label: "New leads sent to", key: "newLeadsSentTo" },
    ],
  },
];

const supplierSections: DetailSection[] = [
  {
    title: "Company details",
    fields: [
      { label: "Company name", key: "companyName" },
      { label: "Trading name", key: "tradingName" },
      { label: "Business identifier", key: "businessIdentifier" },
      { label: "Industry category", key: "industryCategory.name" },
      { label: "Website", key: "website" },
      { label: "Showroom locations", key: "showroomLocations" },
      { label: "Service areas", key: "serviceAreas" },
    ],
  },
  {
    title: "Primary contact",
    fields: [
      { label: "Contact name", key: "primaryContactName" },
      { label: "Email", key: "primaryContactEmail" },
      { label: "Phone", key: "primaryContactPhone" },
    ],
  },
  {
    title: "Sales contact",
    fields: [
      { label: "Name", key: "salesContactName" },
      { label: "Email", key: "salesContactEmail" },
      { label: "Phone", key: "salesContactPhone" },
    ],
  },
  {
    title: "Marketing contact",
    fields: [
      { label: "Name", key: "marketingContactName" },
      { label: "Email", key: "marketingContactEmail" },
      { label: "Phone", key: "marketingContactPhone" },
    ],
  },
  {
    title: "Product support",
    fields: [
      { label: "Name", key: "productSupportContactName" },
      { label: "Email", key: "productSupportContactEmail" },
      { label: "Phone", key: "productSupportContactPhone" },
      { label: "Warehouse location", key: "primaryWarehouseLocation" },
      { label: "Customer support phone", key: "customerSupportPhone" },
      { label: "General enquiries email", key: "generalEnquiriesEmail" },
    ],
  },
];

const hiddenAdditionalKeys = new Set([
  "id",
  "userId",
  "deletedAt",
  "industryCategoryId",
  "industryCategory",
]);

const getNestedValue = (source: Record<string, unknown>, key: string): unknown =>
  key.split(".").reduce<unknown>((value, part) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    return (value as Record<string, unknown>)[part];
  }, source);

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Intl.DateTimeFormat("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  return String(value);
};

const getStatusClassName = (status: string) => status.toLowerCase();

export function AdminProfileDetailPage({ id, type }: AdminProfileDetailPageProps) {
  const [detail, setDetail] = useState<AdminProfileDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isBuilder = type === "builder";
  const listPath = isBuilder ? "/admin/builders" : "/admin/suppliers";
  const title = isBuilder ? "Builder details" : "Supplier details";
  const sections = isBuilder ? builderSections : supplierSections;
  const EntityIcon = isBuilder ? HomeIcon : BoxIcon;

  useEffect(() => {
    let isCurrent = true;

    const loadDetail = async () => {
      setIsLoading(true);
      setError("");

      try {
        const detailResponse = isBuilder
          ? (await adminApi.getBuilderDetail(id)).data.builder
          : (await adminApi.getSupplierDetail(id)).data.supplier;

        if (isCurrent) {
          setDetail(detailResponse);
        }
      } catch (detailError) {
        if (isCurrent) {
          setError(getErrorMessage(detailError));
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isCurrent = false;
    };
  }, [id, isBuilder]);

  const additionalFields = useMemo(() => {
    if (!detail) {
      return [];
    }

    const renderedKeys = new Set(sections.flatMap((section) => section.fields.map((field) => field.key.split(".")[0])));

    return Object.entries(detail.profile)
      .filter(([key]) => !renderedKeys.has(key) && !hiddenAdditionalKeys.has(key))
      .map(([key, value]) => ({ label: formatLabel(key), value }));
  }, [detail, sections]);

  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header admin-detail-header">
          <div>
            <p>{isBuilder ? "Builder management" : "Supplier management"}</p>
            <h1>{title}</h1>
            <span>Full registration profile, account state and onboarding details.</span>
          </div>
          <Link className="admin-back-link" href={listPath}><ArrowIcon size={16} /> Back to list</Link>
        </header>

        {isLoading ? (
          <section className="admin-panel admin-detail-state">Loading {title.toLowerCase()}...</section>
        ) : error ? (
          <section className="admin-panel admin-detail-state">{error}</section>
        ) : detail ? (
          <>
            <section className="admin-detail-hero">
              <article>
                <span><EntityIcon size={24} /></span>
                <div>
                  <small>{detail.summary.code}</small>
                  <h2>{detail.summary.name}</h2>
                  <p>{detail.summary.location}</p>
                </div>
                <em className={getStatusClassName(detail.summary.status)}>{detail.summary.status}</em>
              </article>
              <article>
                <span><UserIcon size={22} /></span>
                <div>
                  <small>Primary contact</small>
                  <strong>{detail.summary.primary}</strong>
                  <p>{detail.summary.secondary}</p>
                </div>
              </article>
              <article>
                <span><PhoneIcon size={22} /></span>
                <div>
                  <small>Phone</small>
                  <strong>{formatValue(detail.summary.phone)}</strong>
                  <p>User status: {formatValue(detail.summary.userStatus)}</p>
                </div>
              </article>
              <article>
                <span><MailIcon size={22} /></span>
                <div>
                  <small>Account email</small>
                  <strong>{formatValue(detail.user.email)}</strong>
                  <p>Last login: {formatValue(detail.user.lastLoginAt)}</p>
                </div>
              </article>
            </section>

            <section className="admin-detail-layout">
              {sections.map((section) => (
                <article className="admin-panel admin-detail-card" key={section.title}>
                  <header>
                    <div>
                      <h2>{section.title}</h2>
                      <p>Captured during {isBuilder ? "builder" : "supplier"} registration.</p>
                    </div>
                  </header>
                  <div className="admin-detail-grid">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <small>{field.label}</small>
                        <strong>{formatValue(getNestedValue(detail.profile, field.key))}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              {additionalFields.length ? (
                <article className="admin-panel admin-detail-card">
                  <header>
                    <div>
                      <h2>System details</h2>
                      <p>Profile status, timestamps and admin lifecycle fields.</p>
                    </div>
                  </header>
                  <div className="admin-detail-grid">
                    {additionalFields.map((field) => (
                      <div key={field.label}>
                        <small>{field.label}</small>
                        <strong>{formatValue(field.value)}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </section>
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
