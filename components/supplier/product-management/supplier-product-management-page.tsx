"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilterIcon, GridIcon, ListIcon, PlusIcon, SearchIcon, UploadIcon } from "@/components/icons";
import { MetricCard } from "@/components/builder/products/metric-card";
import { ProductCard } from "@/components/builder/products/product-card";
import { SupplierShell } from "@/components/supplier/supplier-shell";
import { supplierProductCategories, supplierProducts as initialProducts, supplierProductStats } from "@/components/supplier/product-management/data";

export function SupplierProductManagementPage() {
  const [products] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notice, setNotice] = useState("Supplier product library ready.");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "All products" || product.category === activeCategory;
      const matchesQuery = [product.name, product.supplier, product.room, product.category, product.status].join(" ").toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.id - a.id);
  }, [activeCategory, products, query, sortBy]);

  return (
    <SupplierShell>
      <section className="builder-main products-main">
        <header className="products-header">
          <div>
            <p>Supplier / Product Management</p>
            <h1>Product Management</h1>
            <span>Add, manage and verify supplier products for builder display homes.</span>
          </div>
          <div className="products-actions">
            <Link className="purple" href="/supplier/product-management/upload-pdf"><UploadIcon size={17} /> Upload PDF</Link>
            <Link className="gold" href="/supplier/product-management/add"><PlusIcon size={17} /> Add product</Link>
          </div>
        </header>

        <section className="product-stats" aria-label="Supplier product statistics">
          {supplierProductStats.map((stat) => <MetricCard key={stat.label} stat={stat} />)}
        </section>

        <section className="product-toolbar">
          <div className="product-tabs">
            {supplierProductCategories.map((category) => <button className={activeCategory === category ? "active" : ""} key={category} onClick={() => setActiveCategory(category)} type="button">{category}</button>)}
          </div>
          <div className="product-search-tools">
            <label><input onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier products..." value={query} /><SearchIcon size={17} /></label>
            <button onClick={() => setNotice("Filters opened.")} type="button"><FilterIcon size={16} /> Filters <span>&#8964;</span></button>
          </div>
        </section>

        <section className="product-listing">
          <header>
            <span>{visibleProducts.length} products found</span>
            <div>
              <label>Sort by:<select onChange={(event) => setSortBy(event.target.value)} value={sortBy}><option value="recent">Recently added</option><option value="name">Name A-Z</option></select></label>
              <button className={viewMode === "grid" ? "active" : ""} aria-label="Grid view" onClick={() => setViewMode("grid")} type="button"><GridIcon size={18} /></button>
              <button className={viewMode === "list" ? "active" : ""} aria-label="List view" onClick={() => setViewMode("list")} type="button"><ListIcon size={18} /></button>
            </div>
          </header>
          <div className={`product-cards ${viewMode}`}>
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAction={setNotice} />)}
          </div>
        </section>
        <p className="product-notice" role="status">{notice}</p>
      </section>
    </SupplierShell>
  );
}
