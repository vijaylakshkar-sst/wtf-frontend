"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { AnalyticsMetricCard } from "@/components/builder/analytics/analytics-metric-card";
import { ConversionFunnelCard } from "@/components/builder/analytics/conversion-funnel-card";
import { CustomerBehaviourCard } from "@/components/builder/analytics/customer-behaviour-card";
import { ProductAnalyticsTable } from "@/components/builder/analytics/product-analytics-table";
import { VisitsLineChart } from "@/components/builder/analytics/visits-line-chart";
import { analyticsByYear, analyticsYears, type AnalyticsYear } from "@/components/builder/analytics/data";
import { supplierProductCatalog, type Product } from "@/components/builder/products/data";
import { BoxIcon, BookOpenIcon, CheckIcon, EditIcon, EyeIcon, FilterIcon, FlagIcon, HomeIcon, SparklesIcon, TagIcon, UsersIcon } from "@/components/icons";

type ProductDetailPageProps = {
  product: Product;
};

const productStatusLabel: Record<Product["status"], string> = {
  Verified: "Verified & live",
  "AI mapped": "AI mapped",
  Flagged: "Flagged",
  Draft: "Draft",
};

const editableStatuses: Product["status"][] = ["Draft", "AI mapped", "Verified", "Flagged"];

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [selectedYear, setSelectedYear] = useState<AnalyticsYear>("2026");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<Product["status"]>(product.status);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapSupplierId, setMapSupplierId] = useState<(typeof supplierProductCatalog)[number]["id"]>(supplierProductCatalog[0].id);
  const [mapProductCode, setMapProductCode] = useState<string>(supplierProductCatalog[0].products[0].code);
  const analytics = analyticsByYear[selectedYear];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatusModalOpen(false);
        setMapModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const insights = useMemo(() => {
    const seed = currentProduct.id * 37;
    const views = 120 + (seed % 280);
    const saves = 34 + (seed % 88);
    const selections = 4 + (seed % 16);
    const confidence = currentProduct.status === "Flagged" ? 42 : currentProduct.status === "Draft" ? 68 : currentProduct.status === "AI mapped" ? 84 : 93;
    const activity = [
      { label: "Created in library", value: "2 days ago" },
      { label: "Latest review", value: currentProduct.status === "Flagged" ? "Needs manual mapping" : "Approved for display home" },
      { label: "Visibility", value: currentProduct.status === "Draft" ? "Hidden" : "Published" },
    ];

    return { activity, confidence, saves, selections, views };
  }, [currentProduct.id, currentProduct.status]);

  const selectedSupplier = supplierProductCatalog.find((supplier) => supplier.id === mapSupplierId) ?? supplierProductCatalog[0];
  const selectedMapProduct = selectedSupplier.products.find((item) => item.code === mapProductCode) ?? selectedSupplier.products[0];

  const saveStatus = () => {
    setCurrentProduct((current) => ({ ...current, status: statusValue }));
    setStatusModalOpen(false);
  };

  const saveMap = () => {
    setCurrentProduct((current) => ({
      ...current,
      category: selectedMapProduct.category,
      name: selectedMapProduct.name,
      room: selectedMapProduct.room,
      status: "AI mapped",
      supplier: selectedSupplier.supplier,
    }));
    setMapModalOpen(false);
  };

  const openMapModal = () => {
    const matchedSupplier =
      supplierProductCatalog.find((supplier) => supplier.supplier.toLowerCase() === currentProduct.supplier.toLowerCase()) ??
      supplierProductCatalog[0];

    setMapSupplierId(matchedSupplier.id);
    setMapProductCode(matchedSupplier.products[0].code);
    setMapModalOpen(true);
  };

  return (
    <BuilderShell>
      <main className="builder-main analytics-main product-detail-main">
        <header className="product-detail-header">
          <div>
            <p>Home / Products / {currentProduct.category}</p>
            <h1>{currentProduct.name}</h1>
            <span>{currentProduct.supplier} • {currentProduct.room} • {currentProduct.category}</span>
          </div>
          <div className="analytics-header-actions product-detail-actions">
            <label>
              <UsersIcon size={16} />
              <select aria-label="Product analytics year" onChange={(event) => setSelectedYear(event.target.value as AnalyticsYear)} value={selectedYear}>
                {analyticsYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <Link className="product-detail-action-link" href="/builder/products/add"><EditIcon size={16} /> Edit</Link>
            {currentProduct.status === "Flagged" ? <button onClick={openMapModal} type="button"><SparklesIcon size={16} /> Map</button> : null}
            <button onClick={() => { setStatusValue(currentProduct.status); setStatusModalOpen(true); }} type="button"><FilterIcon size={16} /> Update status</button>
          </div>
        </header>

        <section className="product-detail-hero">
          <div className="product-detail-image-wrap">
            <span className={`product-detail-status ${currentProduct.status.toLowerCase().replace(" ", "-")}`}>
              {currentProduct.status === "Flagged" ? <FlagIcon size={13} /> : currentProduct.status === "AI mapped" ? <SparklesIcon size={13} /> : <CheckIcon size={13} />}
              {productStatusLabel[currentProduct.status]}
            </span>
            <div className="product-detail-image" style={{ backgroundImage: `url("${currentProduct.image}")`, backgroundPosition: currentProduct.imagePosition }} />
          </div>

          <div className="product-detail-summary">
            <div className="product-detail-summary-top">
              <div>
                <p>Product overview</p>
                <h2>{currentProduct.name}</h2>
              </div>
              <span className={`product-detail-pill ${currentProduct.status.toLowerCase().replace(" ", "-")}`}>{currentProduct.status}</span>
            </div>

            <div className="product-detail-meta-grid">
              <article>
                <span><HomeIcon size={18} /></span>
                <strong>{currentProduct.room}</strong>
                <small>Mapped room</small>
              </article>
              <article>
                <span><TagIcon size={18} /></span>
                <strong>{currentProduct.category}</strong>
                <small>Product category</small>
              </article>
              <article>
                <span><UsersIcon size={18} /></span>
                <strong>{currentProduct.supplier}</strong>
                <small>Supplier / brand</small>
              </article>
              <article>
                <span><EyeIcon size={18} /></span>
                <strong>#{currentProduct.id.toString().padStart(3, "0")}</strong>
                <small>Internal product ID</small>
              </article>
            </div>

            <p className="product-detail-description">
              This product is currently shown as <strong>{productStatusLabel[currentProduct.status]}</strong>. Use the actions above to edit details, update the status, or jump into mapping.
            </p>

            <div className="product-detail-activity">
              {insights.activity.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-detail-metrics">
          <AnalyticsMetricCard change="18%" iconTone="violet" index={0} label="Product views" value={insights.views.toLocaleString()} />
          <AnalyticsMetricCard change="12%" iconTone="blue" index={1} label="Saves" value={insights.saves.toLocaleString()} />
          <AnalyticsMetricCard change="9%" iconTone="green" index={2} label="Selections" value={insights.selections.toString()} />
          <AnalyticsMetricCard change={`${insights.confidence}%`} iconTone="gold" index={3} label="Mapping confidence" value={`${insights.confidence}%`} />
        </section>

        <section className="product-detail-grid">
          <VisitsLineChart selectedYear={selectedYear} visits={analytics.visitsByDay} />
          <ConversionFunnelCard rows={analytics.funnelRows} />
        </section>

        <section className="product-detail-grid">
          <ProductAnalyticsTable mode="viewed" rows={analytics.mostViewedProducts} title="Related products by views" />
          <ProductAnalyticsTable mode="saved" rows={analytics.savedProducts} title="Related products by saves" />
        </section>

        <CustomerBehaviourCard stats={analytics.behaviourStats} />
        <p className="analytics-footnote">Product detail analytics are shown alongside the current product record for quick review and editing.</p>

        {statusModalOpen ? (
          <div className="product-detail-status-modal-overlay" onClick={() => setStatusModalOpen(false)} role="presentation">
            <div
              aria-labelledby="product-detail-status-modal-title"
              aria-modal="true"
              className="product-detail-status-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <header className="product-status-modal-header">
                <div>
                  <p>Update status</p>
                  <h2 id="product-detail-status-modal-title">{currentProduct.name}</h2>
                  <span>{currentProduct.supplier} - {currentProduct.room} - {currentProduct.category}</span>
                </div>
                <button aria-label="Close status dialog" onClick={() => setStatusModalOpen(false)} type="button">×</button>
              </header>
              <div className="product-status-modal-body">
                <span className="product-status-modal-label">Choose a status</span>
                <div className="product-status-options" role="radiogroup" aria-label="Product status">
                  {editableStatuses.map((status) => {
                    const selected = statusValue === status;
                    return (
                      <label className={`product-status-option ${selected ? "selected" : ""} ${status.toLowerCase().replace(" ", "-")}`} key={status}>
                        <input checked={selected} onChange={() => setStatusValue(status)} type="radio" name="detail-product-status" value={status} />
                        <span className="product-status-option-control" aria-hidden="true" />
                        <span className="product-status-option-copy">
                          <strong>{productStatusLabel[status]}</strong>
                          <small>
                            {status === "Verified" && "Ready to publish in the display home experience."}
                            {status === "AI mapped" && "Linked to AI mapping results and review flow."}
                            {status === "Flagged" && "Needs review or a manual product mapping step."}
                            {status === "Draft" && "Still in progress and not visible as verified yet."}
                          </small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <footer className="product-status-modal-footer">
                <button className="secondary" onClick={() => setStatusModalOpen(false)} type="button">Cancel</button>
                <button className="primary" onClick={saveStatus} type="button">Save status</button>
              </footer>
            </div>
          </div>
        ) : null}

        {mapModalOpen ? (
          <div className="product-detail-map-modal-overlay" onClick={() => setMapModalOpen(false)} role="presentation">
            <div
              aria-labelledby="product-detail-map-modal-title"
              aria-modal="true"
              className="product-detail-map-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <header className="product-map-modal-header">
                <div>
                  <p>Verify & map</p>
                  <h2 id="product-detail-map-modal-title">Map product</h2>
                  <span>Choose the supplier product this item should map to.</span>
                </div>
                <button aria-label="Close map dialog" onClick={() => setMapModalOpen(false)} type="button">×</button>
              </header>

              <div className="product-map-modal-summary">
                <span
                  className="product-map-modal-thumb"
                  style={{ backgroundImage: `url("${currentProduct.image}")`, backgroundPosition: currentProduct.imagePosition }}
                />
                <div>
                  <strong>{currentProduct.name}</strong>
                  <p>{currentProduct.supplier} • {currentProduct.room} • {currentProduct.category}</p>
                </div>
                <button className="product-map-modal-approve" onClick={saveMap} type="button">Approve</button>
              </div>

              <div className="product-map-modal-body">
                <label className="product-map-field">
                  <span>Supplier</span>
                  <div>
                    <BoxIcon size={18} />
                    <select onChange={(event) => setMapSupplierId(event.target.value as (typeof supplierProductCatalog)[number]["id"])} value={mapSupplierId}>
                      {supplierProductCatalog.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.supplier}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <label className="product-map-field">
                  <span>Supplier product</span>
                  <div>
                    <TagIcon size={18} />
                    <select onChange={(event) => setMapProductCode(event.target.value)} value={mapProductCode}>
                      {selectedSupplier.products.map((item) => (
                        <option key={item.code} value={item.code}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <label className="product-map-field">
                  <span>Room</span>
                  <div>
                    <BookOpenIcon size={18} />
                    <input readOnly value={selectedMapProduct.room} />
                  </div>
                </label>
                <label className="product-map-field">
                  <span>Product code</span>
                  <div>
                    <TagIcon size={18} />
                    <input readOnly value={selectedMapProduct.code} />
                  </div>
                </label>
              </div>

              <footer className="product-map-modal-footer">
                <button className="secondary" onClick={() => setMapModalOpen(false)} type="button">Cancel</button>
                <button className="primary" onClick={saveMap} type="button">Approve mapping</button>
              </footer>
            </div>
          </div>
        ) : null}
      </main>
    </BuilderShell>
  );
}
