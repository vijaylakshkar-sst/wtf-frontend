"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BuilderShell } from "@/components/builder/builder-shell";
import { BoxIcon, BookOpenIcon, CheckIcon, EditIcon, EyeIcon, FilterIcon, FlagIcon, GridIcon, ListIcon, PlusIcon, SearchIcon, SparklesIcon, TagIcon, XIcon } from "@/components/icons";
import { MetricCard } from "@/components/builder/products/metric-card";
import { ProductCard } from "@/components/builder/products/product-card";
import type { Product } from "@/components/builder/products/data";
import { productCategories, products as initialProducts, productStats, supplierProductCatalog } from "@/components/builder/products/data";
import { ThemedSelect } from "@/components/themed-select";

const pageSize = 12;
const statusOptions = ["All statuses", "Verified", "AI mapped", "Flagged", "Draft"] as const;
type ProductStatusFilter = (typeof statusOptions)[number];
const statusLabels: Record<Product["status"], string> = {
  Verified: "Verified & live",
  "AI mapped": "AI mapped",
  Flagged: "Flagged",
  Draft: "Draft",
};
const editableStatuses: Product["status"][] = ["Draft", "AI mapped", "Verified", "Flagged"];
const initialMapSelection = supplierProductCatalog[0];

export function ProductLibraryPage() {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("All statuses");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [notice, setNotice] = useState("Product library ready.");
  const [statusModalProduct, setStatusModalProduct] = useState<Product | null>(null);
  const [statusModalValue, setStatusModalValue] = useState<Product["status"]>("Draft");
  const [mapModalProduct, setMapModalProduct] = useState<Product | null>(null);
  const [mapSupplierId, setMapSupplierId] = useState<(typeof supplierProductCatalog)[number]["id"]>(initialMapSelection.id);
  const [mapProductCode, setMapProductCode] = useState<string>(initialMapSelection.products[0].code);
  const tabsRailRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
    ignoreClick: false,
  });

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "All products" || product.category === activeCategory;
      const matchesStatus = statusFilter === "All statuses" || product.status === statusFilter;
      const matchesQuery = [product.name, product.supplier, product.room, product.category, product.status].join(" ").toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.id - a.id);
  }, [activeCategory, products, query, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return visibleProducts.slice(start, start + pageSize);
  }, [safeCurrentPage, visibleProducts]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatusModalProduct(null);
        setMapModalProduct(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const requestStatusUpdate = (product: Product) => {
    setStatusModalProduct(product);
    setStatusModalValue(product.status);
  };

  const requestMapProduct = (product: Product) => {
    const matchedSupplier =
      supplierProductCatalog.find((supplier) => supplier.supplier.toLowerCase() === product.supplier.toLowerCase()) ??
      initialMapSelection;

    setMapModalProduct(product);
    setMapSupplierId(matchedSupplier.id);
    setMapProductCode(matchedSupplier.products[0].code);
  };

  const saveStatusUpdate = () => {
    if (!statusModalProduct) {
      return;
    }

    setProducts((currentProducts) => currentProducts.map((product) => (
      product.id === statusModalProduct.id ? { ...product, status: statusModalValue } : product
    )));
    setNotice(`Status updated for ${statusModalProduct.name}.`);
    setStatusModalProduct(null);
  };

  const saveMapUpdate = () => {
    if (!mapModalProduct) {
      return;
    }

    const selectedSupplier = supplierProductCatalog.find((supplier) => supplier.id === mapSupplierId) ?? initialMapSelection;
    const selectedProduct = selectedSupplier.products.find((product) => product.code === mapProductCode) ?? selectedSupplier.products[0];

    setProducts((currentProducts) => currentProducts.map((product) => (
      product.id === mapModalProduct.id
        ? {
            ...product,
            category: selectedProduct.category,
            name: selectedProduct.name,
            room: selectedProduct.room,
            status: "AI mapped",
            supplier: selectedSupplier.supplier,
          }
        : product
    )));

    setNotice(`Mapped ${mapModalProduct.name} to ${selectedProduct.code}.`);
    setMapModalProduct(null);
  };

  const viewProduct = (product: Product) => {
    router.push(`/builder/products/${product.id}`);
  };

  const editProduct = () => {
    router.push("/builder/products/add");
  };

  const selectedMapSupplier = supplierProductCatalog.find((supplier) => supplier.id === mapSupplierId) ?? initialMapSelection;
  const selectedMapProduct = selectedMapSupplier.products.find((product) => product.code === mapProductCode) ?? selectedMapSupplier.products[0];

  const handleTabsMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !tabsRailRef.current) {
      return;
    }

    dragStateRef.current.isDown = true;
    dragStateRef.current.didDrag = false;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.startScrollLeft = tabsRailRef.current.scrollLeft;
    tabsRailRef.current.classList.add("is-dragging");

    const handleMove = (moveEvent: MouseEvent) => {
      if (!dragStateRef.current.isDown || !tabsRailRef.current) {
        return;
      }

      const delta = moveEvent.clientX - dragStateRef.current.startX;
      if (Math.abs(delta) > 4) {
        dragStateRef.current.didDrag = true;
        dragStateRef.current.ignoreClick = true;
      }

      tabsRailRef.current.scrollLeft = dragStateRef.current.startScrollLeft - delta;
    };

    const endTabsDrag = () => {
      if (tabsRailRef.current) {
        tabsRailRef.current.classList.remove("is-dragging");
      }

      dragStateRef.current.isDown = false;
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", endTabsDrag);
      window.setTimeout(() => {
        dragStateRef.current.ignoreClick = false;
      }, 0);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", endTabsDrag);
  };

  return (
    <BuilderShell>
      <section className="builder-main products-main">
        <header className="products-header">
          <div>
            <p>Home / Products</p>
            <h1>Product Library</h1>
            <span>Manage, verify and map products for Tarneit 42 display home.</span>
          </div>
          <div className="products-actions">
            {/* <button onClick={() => setNotice("AI catalogue scan started.")} type="button"><SparklesIcon size={17} /> AI scan catalogue</button>
            <Link className="purple" href="/builder/products/upload-pdf"><UploadIcon size={17} /> Upload PDF</Link> */}
            <Link className="gold" href="/builder/products/add"><PlusIcon size={17} /> Add product</Link>
          </div>
        </header>

        <section className="product-stats" aria-label="Product library statistics">
          {productStats.map((stat) => <MetricCard key={stat.label} stat={stat} />)}
        </section>

        <section className="product-toolbar">
          <div
            className="product-tabs"
            onMouseDown={handleTabsMouseDown}
            ref={tabsRailRef}
          >
            {productCategories.map((category) => (
              <button
                className={activeCategory === category ? "active" : ""}
                key={category}
                onClick={() => {
                  if (dragStateRef.current.ignoreClick) {
                    dragStateRef.current.ignoreClick = false;
                    return;
                  }
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <div className="product-search-tools">
            <label className="product-search-input">
              <input
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                value={query}
              />
              <SearchIcon size={17} />
            </label>
            <div className="status-filter product-status-filter">
              <FilterIcon size={15} />
              <ThemedSelect
                ariaLabel="Filter products by status"
                className="product-status-select"
                onChange={(value) => {
                  setStatusFilter(value as ProductStatusFilter);
                  setCurrentPage(1);
                }}
                options={statusOptions.map((status) => ({ label: status, value: status }))}
                placeholder="All statuses"
                value={statusFilter}
              />
            </div>
          </div>
        </section>

        <section className="product-listing">
          <header>
            <span>{visibleProducts.length} products found</span>
            <div>
              <label>Sort by:<select onChange={(event) => { setSortBy(event.target.value); setCurrentPage(1); }} value={sortBy}><option value="recent">Recently added</option><option value="name">Name A-Z</option></select></label>
              <button className={viewMode === "grid" ? "active" : ""} aria-label="Grid view" onClick={() => setViewMode("grid")} type="button"><GridIcon size={18} /></button>
              <button className={viewMode === "list" ? "active" : ""} aria-label="List view" onClick={() => setViewMode("list")} type="button"><ListIcon size={18} /></button>
            </div>
          </header>
          {viewMode === "grid" ? (
            <div className={`product-cards ${viewMode}`}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  onEditRequest={editProduct}
                  onMapRequest={requestMapProduct}
                  onStatusRequest={requestStatusUpdate}
                  onViewRequest={viewProduct}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="product-table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>Room</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-table-product">
                          <span className="product-table-thumb" style={{ backgroundImage: `url("${product.image}")`, backgroundPosition: product.imagePosition }} />
                          <div>
                            <strong>{product.name}</strong>
                            <small>#{product.id.toString().padStart(3, "0")}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.supplier}</td>
                      <td>{product.room}</td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`product-table-status ${product.status.toLowerCase().replace(" ", "-")}`}>
                          {product.status === "Flagged" ? <FlagIcon size={12} /> : product.status === "AI mapped" ? <SparklesIcon size={12} /> : <CheckIcon size={12} />}
                          {statusLabels[product.status]}
                        </span>
                      </td>
                      <td>
                        <div className="product-table-actions">
                          <button onClick={() => router.push(`/builder/products/${product.id}`)} type="button"><EyeIcon size={14} /> View</button>
                          <button onClick={() => router.push("/builder/products/add")} type="button"><EditIcon size={14} /> Edit</button>
                          {product.status === "Flagged" ? (
                            <button onClick={() => requestMapProduct(product)} type="button"><SparklesIcon size={14} /> Map</button>
                          ) : null}
                          <button onClick={() => requestStatusUpdate(product)} type="button"><FilterIcon size={14} /> Update status</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <nav className="product-pagination" aria-label="Product pagination">
          <span>Showing {visibleProducts.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}-{Math.min(safeCurrentPage * pageSize, visibleProducts.length)} of {visibleProducts.length}</span>
          <div>
            <button disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">Prev</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button className={page === safeCurrentPage ? "active" : ""} key={page} onClick={() => setCurrentPage(page)} type="button">
                {page}
              </button>
            ))}
            <button disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} type="button">Next</button>
          </div>
        </nav>
        <p className="product-notice" role="status">{notice}</p>
        {statusModalProduct ? (
          <div className="product-status-modal-overlay" onClick={() => setStatusModalProduct(null)} role="presentation">
            <div
              aria-labelledby="product-status-modal-title"
              aria-modal="true"
              className="product-status-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <header className="product-status-modal-header">
                <div>
                  <p>Update status</p>
                  <h2 id="product-status-modal-title">{statusModalProduct.name}</h2>
                  <span>{statusModalProduct.supplier} - {statusModalProduct.room} - {statusModalProduct.category}</span>
                </div>
                <button aria-label="Close status dialog" onClick={() => setStatusModalProduct(null)} type="button">×</button>
              </header>
              <div className="product-status-modal-body">
                <span className="product-status-modal-label">Choose a status</span>
                <div className="product-status-options" role="radiogroup" aria-label="Product status">
                  {editableStatuses.map((status) => {
                    const selected = statusModalValue === status;
                    return (
                      <label className={`product-status-option ${selected ? "selected" : ""} ${status.toLowerCase().replace(" ", "-")}`} key={status}>
                        <input checked={selected} onChange={() => setStatusModalValue(status)} type="radio" name="product-status" value={status} />
                        <span className="product-status-option-control" aria-hidden="true" />
                        <span className="product-status-option-copy">
                          <strong>{statusLabels[status]}</strong>
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
                <button className="secondary" onClick={() => setStatusModalProduct(null)} type="button">Cancel</button>
                <button className="primary" onClick={saveStatusUpdate} type="button">Save status</button>
              </footer>
            </div>
          </div>
        ) : null}
        {mapModalProduct ? (
          <div className="product-map-modal-overlay" onClick={() => setMapModalProduct(null)} role="presentation">
            <div
              aria-labelledby="product-map-modal-title"
              aria-modal="true"
              className="product-map-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <header className="product-map-modal-header">
                <div>
                  <p>Verify & map</p>
                  <h2 id="product-map-modal-title">Map product</h2>
                  <span>Choose the supplier product this item should map to.</span>
                </div>
                <button aria-label="Close map dialog" onClick={() => setMapModalProduct(null)} type="button">
                  <XIcon size={22} />
                </button>
              </header>

              <div className="product-map-modal-summary">
                <span
                  className="product-map-modal-thumb"
                  style={{ backgroundImage: `url("${mapModalProduct.image}")`, backgroundPosition: mapModalProduct.imagePosition }}
                />
                <div>
                  <strong>{mapModalProduct.name}</strong>
                  <p>{mapModalProduct.supplier} • {mapModalProduct.room} • {mapModalProduct.category}</p>
                </div>
                <button className="product-map-modal-approve" onClick={saveMapUpdate} type="button">Approve</button>
              </div>

              <div className="product-map-modal-body">
                <ManualField icon={<BoxIcon size={18} />} label="Supplier">
                  <select onChange={(event) => setMapSupplierId(event.target.value as (typeof supplierProductCatalog)[number]["id"])} value={mapSupplierId}>
                    {supplierProductCatalog.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.supplier}
                      </option>
                    ))}
                  </select>
                </ManualField>
                <ManualField icon={<TagIcon size={18} />} label="Supplier product">
                  <select onChange={(event) => setMapProductCode(event.target.value)} value={mapProductCode}>
                    {selectedMapSupplier.products.map((product) => (
                      <option key={product.code} value={product.code}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </ManualField>
                <ManualField icon={<BookOpenIcon size={18} />} label="Room">
                  <input readOnly value={selectedMapProduct.room} />
                </ManualField>
                <ManualField icon={<TagIcon size={18} />} label="Product code">
                  <input readOnly value={selectedMapProduct.code} />
                </ManualField>
                <ManualField icon={<CheckIcon size={18} />} label="Mapped name">
                  <input readOnly value={selectedMapProduct.name} />
                </ManualField>
              </div>

              <footer className="product-map-modal-footer">
                <button className="secondary" onClick={() => setMapModalProduct(null)} type="button">Cancel</button>
                <button className="primary" onClick={saveMapUpdate} type="button">Approve mapping</button>
              </footer>
            </div>
          </div>
        ) : null}
      </section>
    </BuilderShell>
  );
}

function ManualField({ children, className = "", icon, label }: { children: ReactNode; className?: string; icon: ReactNode; label: string }) {
  return (
    <label className={`product-map-field ${className}`}>
      <span>{label}</span>
      <div>{icon}{children}</div>
    </label>
  );
}
