"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, BoxIcon, CheckIcon, ClipboardIcon, EditIcon, SparklesIcon, TagIcon, UploadIcon, XIcon } from "@/components/icons";
import { SupplierShell } from "@/components/supplier/supplier-shell";

const initialForm = {
  name: "",
  code: "",
  brand: "Acme Surfaces",
  category: "Benchtops",
  room: "Kitchen",
  inclusion: "Standard inclusion",
  price: "",
  description: "",
};

export function AddSupplierProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("Supplier product form ready.");

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function finish(message: string) {
    setNotice(message);
    setTimeout(() => router.push("/supplier/product-management"), 450);
  }

  return (
    <SupplierShell>
      <section className="builder-main manual-product-page">
        <section className="manual-product-modal manual-product-page-card">
          <header className="manual-product-header">
            <span><UploadIcon size={29} /></span>
            <div><h2>Add supplier product</h2><p>Add product details for builder catalogues, room mapping and customer selections.</p></div>
            <button aria-label="Close add product page" className="manual-product-close" onClick={() => router.push("/supplier/product-management")} type="button"><XIcon size={24} /></button>
          </header>

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
                <p>Enter the product code below and AI will attempt to match an image from your supplier catalogue.</p>
                <div>
                  <input onChange={(event) => updateField("code", event.target.value)} placeholder="e.g. ACM-CQ-20" value={form.code} />
                  <button onClick={() => setNotice(`AI image search queued for ${form.code || "product code"}.`)} type="button"><SparklesIcon size={17} /> Find image</button>
                </div>
              </div>
            </div>
          </section>

          <section className="manual-product-section">
            <h3>Product details</h3>
            <div className="manual-product-form">
              <ManualField icon={<ClipboardIcon size={20} />} label="Product name *"><input onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Calacatta Quartz 20mm" value={form.name} /></ManualField>
              <ManualField icon={<TagIcon size={20} />} label="Product code"><input onChange={(event) => updateField("code", event.target.value)} placeholder="e.g. ACM-CQ-20" value={form.code} /></ManualField>
              <ManualField icon={<BoxIcon size={20} />} label="Brand master"><select onChange={(event) => updateField("brand", event.target.value)} value={form.brand}><option>Acme Surfaces</option><option>Acme Premium</option></select></ManualField>
              <ManualField icon={<ClipboardIcon size={20} />} label="Product category *"><select onChange={(event) => updateField("category", event.target.value)} value={form.category}><option>Benchtops</option><option>Flooring</option><option>Tapware</option><option>Appliances</option></select></ManualField>
              <ManualField icon={<BookOpenIcon size={20} />} label="Room mapping *"><select onChange={(event) => updateField("room", event.target.value)} value={form.room}><option>Kitchen</option><option>Living</option><option>Bathroom</option><option>Ensuite</option></select></ManualField>
              <ManualField icon={<CheckIcon size={20} />} label="Inclusion type"><select onChange={(event) => updateField("inclusion", event.target.value)} value={form.inclusion}><option>Standard inclusion</option><option>Upgrade</option><option>Optional inclusion</option></select></ManualField>
              <ManualField icon={<span className="manual-dollar">$</span>} label="Price (optional)"><input onChange={(event) => updateField("price", event.target.value)} placeholder="e.g. $320 / m2" value={form.price} /></ManualField>
              <ManualField className="wide" icon={<EditIcon size={20} />} label="Product description (optional)"><textarea onChange={(event) => updateField("description", event.target.value)} placeholder="Brief description visible to display home visitors..." value={form.description} /></ManualField>
            </div>
          </section>

          <div className="manual-product-info"><span>i</span><p><strong>Supplier products go to verification before publishing</strong><br />and can later be associated with builders and display homes.</p></div>

          <footer className="manual-product-footer">
            <button onClick={() => router.push("/supplier/product-management")} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
            <button onClick={() => finish("Supplier product saved as draft.")} type="button"><ClipboardIcon size={19} /> Save as draft</button>
            <button className="primary" onClick={() => finish("Supplier product added to verification queue.")} type="button"><CheckIcon size={19} /> Add to verification queue</button>
          </footer>
          <p className="manual-product-page-notice" role="status">{notice}</p>
        </section>
      </section>
    </SupplierShell>
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
