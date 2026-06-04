"use client";

import { useMemo, useState } from "react";
import { BoxIcon, ChartIcon, CheckIcon, EditIcon, EyeIcon, FilterIcon, SearchIcon, XIcon } from "@/components/icons";
import { SupplierShell } from "@/components/supplier/supplier-shell";
import { inventoryItems, inventoryStats, type InventoryItem, type InventoryStatus } from "@/components/supplier/product-inventory/data";

const statuses: Array<"All statuses" | InventoryStatus> = ["All statuses", "In stock", "Low stock", "Out of stock", "Backorder", "Discontinued"];
const categories = ["All categories", "Tapware", "Benchtops", "Flooring"] as const;

export function ProductInventoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All statuses");
  const [category, setCategory] = useState<(typeof categories)[number]>("All categories");
  const [notice, setNotice] = useState("Inventory view ready.");
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState({
    availableQty: "",
    allocatedQty: "",
    leadTime: "",
    status: "In stock" as InventoryStatus,
    lastUpdated: "",
  });

  const visibleItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesQuery = [item.product, item.sku, item.brand, item.category, item.builders.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All statuses" || item.status === status;
      const matchesCategory = category === "All categories" || item.category === category;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, query, status]);

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setEditForm({
      availableQty: String(item.availableQty),
      allocatedQty: String(item.allocatedQty),
      leadTime: item.leadTime,
      status: item.status,
      lastUpdated: item.lastUpdated,
    });
  }

  function saveInventory() {
    if (!editItem) return;
    setNotice(`${editItem.product} inventory updated.`);
    setEditItem(null);
  }

  return (
    <SupplierShell>
      <section className="builder-main supplier-inventory-main">
        <header className="supplier-inventory-header">
          <div>
            <p>Supplier / Product Inventory</p>
            <h1>Product Inventory</h1>
            <span>Track supplier stock, allocations, builder usage, display home coverage and availability risk.</span>
          </div>
        </header>

        <section className="supplier-inventory-stats" aria-label="Inventory summary">
          {inventoryStats.map((stat, index) => {
            const Icon = index === 0 ? BoxIcon : index === 1 ? ChartIcon : index === 2 ? FilterIcon : SearchIcon;
            return (
              <article key={stat.label}>
                <span><Icon size={21} /></span>
                <div><small>{stat.label}</small><strong>{stat.value}</strong><em>{stat.note}</em></div>
              </article>
            );
          })}
        </section>

        <section className="supplier-panel supplier-inventory-panel">
          <header>
            <div><h2>Inventory list</h2><p>{visibleItems.length} products found</p></div>
            <div className="supplier-inventory-tools">
              <label><SearchIcon size={16} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search product, SKU or builder..." value={query} /></label>
              <select onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])} value={status}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
              <select onChange={(event) => setCategory(event.target.value as (typeof categories)[number])} value={category}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
            </div>
          </header>

          <div className="supplier-inventory-table">
            <div className="supplier-inventory-row head"><span>Product</span><span>SKU</span><span>Available</span><span>Allocated</span><span>Builders</span><span>Lead time</span><span>Status</span><span>Actions</span></div>
            {visibleItems.map((item) => (
              <div className="supplier-inventory-row" key={item.id}>
                <strong>{item.product}<small>{item.brand} - {item.category}</small></strong>
                <span>{item.sku}</span>
                <b>{item.availableQty}</b>
                <span>{item.allocatedQty}</span>
                <span>{item.builders.join(", ")}<small>{item.displayHomes} display homes</small></span>
                <span>{item.leadTime}<small>{item.lastUpdated}</small></span>
                <em className={item.status.toLowerCase().replaceAll(" ", "-")}>{item.status}</em>
                <span className="supplier-inventory-actions">
                  <button aria-label={`View ${item.product}`} onClick={() => setViewItem(item)} type="button"><EyeIcon size={15} /></button>
                  <button aria-label={`Edit ${item.product}`} onClick={() => openEdit(item)} type="button"><EditIcon size={15} /></button>
                </span>
              </div>
            ))}
          </div>
        </section>
        <p className="product-notice" role="status">{notice}</p>

        {viewItem ? (
          <div className="supplier-inventory-modal-overlay">
            <section className="supplier-inventory-modal">
              <header>
                <span><EyeIcon size={22} /></span>
                <div><h2>{viewItem.product}</h2><p>{viewItem.sku} - {viewItem.brand}</p></div>
                <button aria-label="Close inventory view" onClick={() => setViewItem(null)} type="button"><XIcon size={20} /></button>
              </header>
              <div className="supplier-inventory-detail-grid">
                <article><small>Available quantity</small><strong>{viewItem.availableQty}</strong></article>
                <article><small>Allocated quantity</small><strong>{viewItem.allocatedQty}</strong></article>
                <article><small>Lead time</small><strong>{viewItem.leadTime}</strong></article>
                <article><small>Status</small><em className={viewItem.status.toLowerCase().replaceAll(" ", "-")}>{viewItem.status}</em></article>
              </div>
              <section className="supplier-inventory-detail-section">
                <h3>Builder usage</h3>
                <div className="supplier-inventory-builder-tags">{viewItem.builders.map((builder) => <span key={builder}>{builder}</span>)}</div>
                <p>{viewItem.displayHomes} display homes are currently using this product.</p>
              </section>
              <section className="supplier-inventory-detail-section">
                <h3>Product classification</h3>
                <p><strong>Category:</strong> {viewItem.category}</p>
                <p><strong>Last updated:</strong> {viewItem.lastUpdated}</p>
              </section>
            </section>
          </div>
        ) : null}

        {editItem ? (
          <div className="supplier-inventory-modal-overlay">
            <section className="supplier-inventory-modal">
              <header>
                <span><EditIcon size={22} /></span>
                <div><h2>Edit inventory</h2><p>{editItem.product} - {editItem.sku}</p></div>
                <button aria-label="Close inventory edit" onClick={() => setEditItem(null)} type="button"><XIcon size={20} /></button>
              </header>
              <div className="supplier-inventory-edit-grid">
                <label><span>Available quantity</span><input onChange={(event) => setEditForm((form) => ({ ...form, availableQty: event.target.value }))} value={editForm.availableQty} /></label>
                <label><span>Allocated quantity</span><input onChange={(event) => setEditForm((form) => ({ ...form, allocatedQty: event.target.value }))} value={editForm.allocatedQty} /></label>
                <label><span>Lead time</span><input onChange={(event) => setEditForm((form) => ({ ...form, leadTime: event.target.value }))} value={editForm.leadTime} /></label>
                <label><span>Status</span><select onChange={(event) => setEditForm((form) => ({ ...form, status: event.target.value as InventoryStatus }))} value={editForm.status}>{statuses.filter((item) => item !== "All statuses").map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="wide"><span>Last updated</span><input onChange={(event) => setEditForm((form) => ({ ...form, lastUpdated: event.target.value }))} value={editForm.lastUpdated} /></label>
              </div>
              <footer>
                <button onClick={() => setEditItem(null)} type="button">Cancel</button>
                <button className="primary" onClick={saveInventory} type="button"><CheckIcon size={16} /> Save inventory</button>
              </footer>
            </section>
          </div>
        ) : null}
      </section>
    </SupplierShell>
  );
}
