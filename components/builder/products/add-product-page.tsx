"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BuilderShell } from "@/components/builder/builder-shell";
import { BookOpenIcon, BoxIcon, CheckIcon, ClipboardIcon, EditIcon, HomeIcon, SparklesIcon, TagIcon, UploadIcon, XIcon } from "@/components/icons";
import { supplierProductCatalog } from "@/components/builder/products/data";

const initialForm = {
  name: "",
  code: "",
  supplier: "",
  category: "Benchtops",
  room: "Kitchen",
  inclusion: "Standard inclusion",
  price: "",
  description: "",
};

export function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("Manual product form ready.");
  const [source, setSource] = useState<"own" | "supplier">("own");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierProductCatalog[0].id);
  const [selectedProductCode, setSelectedProductCode] = useState<string>(supplierProductCatalog[0].products[0].code);
  const selectedSupplier = supplierProductCatalog.find((supplier) => supplier.id === selectedSupplierId) ?? supplierProductCatalog[0];
  const selectedSupplierProduct = selectedSupplier.products.find((product) => product.code === selectedProductCode) ?? selectedSupplier.products[0];

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function finish(message: string) {
    setNotice(message);
    setTimeout(() => router.push("/builder/products"), 450);
  }

  function chooseSupplier(supplierId: string) {
    const supplier = supplierProductCatalog.find((item) => item.id === supplierId) ?? supplierProductCatalog[0];
    setSelectedSupplierId(supplier.id);
    setSelectedProductCode(supplier.products[0].code);
    setNotice(`${supplier.supplier} products loaded.`);
  }

  return (
    <BuilderShell>
      <section className="builder-main manual-product-page">
        <section className="manual-product-modal manual-product-page-card">
          <header className="manual-product-header">
            <span><UploadIcon size={29} /></span>
            <div><h2>Add product manually</h2><p>Choose an existing supplier product or add your own product details.</p></div>
            <button aria-label="Close add product page" className="manual-product-close" onClick={() => router.push("/builder/products")} type="button"><XIcon size={24} /></button>
          </header>

          <section className="manual-product-section">
            <h3>Product source</h3>
            <div className="manual-product-source-toggle">
              <button className={source === "own" ? "active" : ""} onClick={() => setSource("own")} type="button"><UploadIcon size={18} /> Own product</button>
              <button className={source === "supplier" ? "active" : ""} onClick={() => setSource("supplier")} type="button"><BoxIcon size={18} /> Supplier product</button>
            </div>
            {source === "supplier" ? (
              <div className="supplier-product-picker">
                <ManualField icon={<BoxIcon size={20} />} label="Supplier"><select onChange={(event) => chooseSupplier(event.target.value)} value={selectedSupplierId}>{supplierProductCatalog.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.supplier}</option>)}</select></ManualField>
                <ManualField icon={<ClipboardIcon size={20} />} label="Supplier product"><select onChange={(event) => setSelectedProductCode(event.target.value)} value={selectedProductCode}>{selectedSupplier.products.map((product) => <option key={product.code} value={product.code}>{product.name}</option>)}</select></ManualField>
                <div className="supplier-product-list">
                  {selectedSupplier.products.map((product) => (
                    <button className={product.code === selectedProductCode ? "active" : ""} key={product.code} onClick={() => setSelectedProductCode(product.code)} type="button">
                      <span style={{ backgroundImage: `url("${product.image}")` }} />
                      <div><strong>{product.name}</strong><small>{product.code} &bull; {product.category} &bull; {product.room}</small></div>
                      <em>{product.price}</em>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {source === "own" ? (
          <>
          <section className="manual-product-section">
            <h3>Product image</h3>
            <div className="manual-product-image-row">
              <button className="manual-product-upload" onClick={() => setNotice("Image picker opened.")} type="button">
                <span><UploadIcon size={34} /></span>
                <strong>Upload image</strong>
                <small>JPG, PNG or WEBP<br />Max 10MB</small>
              </button>
              <div className="manual-product-ai-image">
                <h4>Or let AI find the image</h4>
                <p>Enter the product code below and AI will attempt to match an image from the supplier database.</p>
                <div>
                  <input onChange={(event) => updateField("code", event.target.value)} placeholder="e.g. CST-CQ-20" value={form.code} />
                  <button onClick={() => setNotice(`AI image search queued for ${form.code || "product code"}.`)} type="button"><SparklesIcon size={17} /> Find image</button>
                </div>
              </div>
            </div>
          </section>

          <section className="manual-product-section">
            <h3>Product details</h3>
            <div className="manual-product-form">
              <ManualField icon={<ClipboardIcon size={20} />} label="Product name *"><input onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Calacatta Quartz 20mm" value={form.name} /></ManualField>
              <ManualField icon={<TagIcon size={20} />} label="Product code"><input onChange={(event) => updateField("code", event.target.value)} placeholder="e.g. CST-CQ-20" value={form.code} /></ManualField>
              <ManualField icon={<BoxIcon size={20} />} label="Supplier / brand"><input onChange={(event) => updateField("supplier", event.target.value)} placeholder="e.g. Caesarstone" value={form.supplier} /></ManualField>
              <ManualField icon={<ClipboardIcon size={20} />} label="Category *"><select onChange={(event) => updateField("category", event.target.value)} value={form.category}><option>Benchtops</option><option>Flooring</option><option>Cabinetry</option><option>Tapware</option><option>Appliances</option></select></ManualField>
              <ManualField icon={<HomeIcon size={20} />} label="Display home *"><select defaultValue="Tarneit 42 - The Whitmore"><option>Tarneit 42 - The Whitmore</option><option>Hoppers Crossing - The Delray</option></select></ManualField>
              <ManualField icon={<BookOpenIcon size={20} />} label="Room mapping *"><select onChange={(event) => updateField("room", event.target.value)} value={form.room}><option>Kitchen</option><option>Living</option><option>Bathroom</option><option>Ensuite</option><option>Bedroom</option></select></ManualField>
              <ManualField icon={<CheckIcon size={20} />} label="Inclusion type"><select onChange={(event) => updateField("inclusion", event.target.value)} value={form.inclusion}><option>Standard inclusion</option><option>Upgrade</option><option>Optional inclusion</option></select></ManualField>
              <ManualField icon={<span className="manual-dollar">$</span>} label="Price (optional)"><input onChange={(event) => updateField("price", event.target.value)} placeholder="e.g. $320 / m2" value={form.price} /></ManualField>
              <ManualField className="wide" icon={<EditIcon size={20} />} label="Product description (optional)"><textarea onChange={(event) => updateField("description", event.target.value)} placeholder="Brief description visible to display home visitors..." value={form.description} /></ManualField>
            </div>
          </section>
          </>
          ) : (
            <section className="manual-product-section">
              <h3>Selected supplier product</h3>
              <div className="selected-supplier-product">
                <span style={{ backgroundImage: `url("${selectedSupplierProduct.image}")` }} />
                <div>
                  <h4>{selectedSupplierProduct.name}</h4>
                  <p>{selectedSupplier.supplier} &bull; {selectedSupplierProduct.code}</p>
                  <small>{selectedSupplierProduct.category} &bull; Suggested room: {selectedSupplierProduct.room} &bull; {selectedSupplierProduct.price}</small>
                </div>
              </div>
            </section>
          )}

          <div className="manual-product-info"><span>i</span><p><strong>Manually added products go straight to your verification queue</strong><br />and require approval before publishing.</p></div>

          <footer className="manual-product-footer">
            <button onClick={() => router.push("/builder/products")} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
            <button onClick={() => finish(source === "supplier" ? `${selectedSupplierProduct.name} saved as draft.` : "Product saved as draft.")} type="button"><ClipboardIcon size={19} /> Save as draft</button>
            <button className="primary" onClick={() => finish(source === "supplier" ? `${selectedSupplierProduct.name} added to verification queue.` : "Product added to verification queue.")} type="button"><CheckIcon size={19} /> Add to verification queue</button>
          </footer>
          <p className="manual-product-page-notice" role="status">{notice}</p>
        </section>
      </section>
    </BuilderShell>
  );
}

function ManualField({ children, className = "", icon, label }: { children: React.ReactNode; className?: string; icon: React.ReactNode; label: string }) {
  return (
    <label className={`manual-product-field ${className}`}>
      <span>{label}</span>
      <div>{icon}{children}</div>
    </label>
  );
}
