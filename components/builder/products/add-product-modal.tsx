"use client";

import { useState } from "react";
import { BookOpenIcon, BoxIcon, CheckIcon, ClipboardIcon, EditIcon, HomeIcon, SparklesIcon, TagIcon, UploadIcon, XIcon } from "@/components/icons";
import type { Product } from "@/components/builder/products/data";

type AddProductForm = {
  name: string;
  code: string;
  supplier: string;
  category: Product["category"];
  room: string;
  inclusion: string;
  price: string;
  description: string;
};

const initialForm: AddProductForm = {
  name: "",
  code: "",
  supplier: "",
  category: "Benchtops",
  room: "Kitchen",
  inclusion: "Standard inclusion",
  price: "",
  description: "",
};

export function AddProductModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (product: Omit<Product, "id">, mode: "draft" | "verification") => void }) {
  const [form, setForm] = useState(initialForm);
  const productName = form.name.trim() || "New manual product";
  const supplier = form.supplier.trim() || "Manual entry";

  function updateField(field: keyof AddProductForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildProduct(status: Product["status"]): Omit<Product, "id"> {
    return {
      name: productName,
      supplier,
      room: form.room,
      category: form.category,
      status,
      image: "/supplier_section.png",
      imagePosition: "center 62%",
    };
  }

  return (
    <div className="manual-product-overlay" role="presentation">
      <section aria-labelledby="manual-product-title" aria-modal="true" className="manual-product-modal" role="dialog">
        <header className="manual-product-header">
          <span><UploadIcon size={29} /></span>
          <div><h2 id="manual-product-title">Add product manually</h2><p>Fill in product details - no AI processing</p></div>
          <button aria-label="Close add product modal" className="manual-product-close" onClick={onClose} type="button"><XIcon size={24} /></button>
        </header>

        <section className="manual-product-section">
          <h3>Product image</h3>
          <div className="manual-product-image-row">
            <button className="manual-product-upload" onClick={() => updateField("description", "Image selected for upload.")} type="button">
              <span><UploadIcon size={34} /></span>
              <strong>Upload image</strong>
              <small>JPG, PNG or WEBP<br />Max 10MB</small>
            </button>
            <div className="manual-product-ai-image">
              <h4>Or let AI find the image</h4>
              <p>Enter the product code below and AI will attempt to match an image from the supplier database.</p>
              <div>
                <input onChange={(event) => updateField("code", event.target.value)} placeholder="e.g. CST-CQ-20" value={form.code} />
                <button onClick={() => updateField("description", `AI image search queued for ${form.code || "product code"}.`)} type="button"><SparklesIcon size={17} /> Find image</button>
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

        <div className="manual-product-info"><span>i</span><p><strong>Manually added products go straight to your verification queue</strong><br />and require approval before publishing.</p></div>

        <footer className="manual-product-footer">
          <button onClick={onClose} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
          <button onClick={() => onSubmit(buildProduct("Draft"), "draft")} type="button"><ClipboardIcon size={19} /> Save as draft</button>
          <button className="primary" onClick={() => onSubmit(buildProduct("Draft"), "verification")} type="button"><CheckIcon size={19} /> Add to verification queue</button>
        </footer>
      </section>
    </div>
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
