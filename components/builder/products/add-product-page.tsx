"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BuilderShell } from "@/components/builder/builder-shell";
import { BookOpenIcon, BoxIcon, CheckIcon, ClipboardIcon, EditIcon, HomeIcon, SparklesIcon, TagIcon, UploadIcon, XIcon } from "@/components/icons";
import { useToast } from "@/components/toast-provider";
import { supplierProductCatalog } from "@/components/builder/products/data";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { VerifyEditStep } from "@/components/builder/products/upload-pdf/steps/verify-edit-step";
import { extractedProducts, extractionTasks } from "@/components/builder/products/upload-pdf/workflow-data";

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
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("Upload a PDF, image or invoice to begin extraction.");
  const [source, setSource] = useState<"own" | "supplier">("own");
  const [ownMode, setOwnMode] = useState<"manual" | "invoice">("invoice");
  const [uploadStage, setUploadStage] = useState<"form" | "processing" | "results" | "verify" | "published">("form");
  const [submissionView, setSubmissionView] = useState<"none" | "draft" | "published">("none");
  const [processingStep, setProcessingStep] = useState(0);
  const [manualImagePreview, setManualImagePreview] = useState<string>("");
  const [manualImageName, setManualImageName] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(supplierProductCatalog[0].id);
  const [selectedProductCodes, setSelectedProductCodes] = useState<string[]>([supplierProductCatalog[0].products[0].code]);
  const [blockedAction, setBlockedAction] = useState<"save" | "publish" | null>(null);
  const uploadTimerRef = useRef<number | null>(null);
  const blockedActionTimerRef = useRef<number | null>(null);
  const manualImageInputRef = useRef<HTMLInputElement | null>(null);
  const completionState =
    submissionView === "draft"
      ? {
          badgeClass: "manual-product-draft-badge",
          buttonLabel: "Continue editing",
          description: "The product has been saved and you can continue editing it later from the product library.",
          heading: "Your product saved as draft",
          primaryAction: () => setSubmissionView("none"),
          primaryLabel: "Back to products",
          titleClass: "manual-product-draft-title",
        }
      : submissionView === "published"
        ? {
            badgeClass: "",
            buttonLabel: "Add another product",
            description: "Your extracted products are now live and ready for verification and management from the product library.",
            heading: "Product published successfully",
            primaryAction: () => {
              setSubmissionView("none");
              setUploadStage("form");
              setNotice("Start a new product upload.");
            },
            primaryLabel: "Back to products",
            titleClass: "",
          }
        : null;
  const selectedSupplier = supplierProductCatalog.find((supplier) => supplier.id === selectedSupplierId) ?? supplierProductCatalog[0];
  const selectedSupplierProducts = selectedSupplier.products.filter((product) => selectedProductCodes.includes(product.code));

  useEffect(() => {
    if (uploadStage !== "processing") {
      if (uploadTimerRef.current) {
        window.clearInterval(uploadTimerRef.current);
        uploadTimerRef.current = null;
      }
      return;
    }

    if (uploadTimerRef.current) {
      window.clearInterval(uploadTimerRef.current);
    }

    const tick = window.setInterval(() => {
      setProcessingStep((current) => {
        const next = Math.min(current + 1, 6);
        return next;
      });
    }, 1400);

    const doneTimer = window.setTimeout(() => {
      setUploadStage("results");
      setProcessingStep(6);
      window.clearInterval(tick);
      uploadTimerRef.current = null;
    }, 10000);

    uploadTimerRef.current = tick as unknown as number;

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(doneTimer);
    };
  }, [uploadStage]);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveDraft(message: string) {
    setNotice(message);
    setSubmissionView("draft");
  }

  function publishProduct(message = "Product published successfully.") {
    setNotice(message);
    setSubmissionView("published");
  }

  function requireExtractionFirst() {
    setNotice("Please click Upload & start AI extraction first.");
    showToast("Please click Upload & start AI extraction first.", "error");
  }

  function pulseBlockedAction(action: "save" | "publish") {
    setBlockedAction(action);
    if (blockedActionTimerRef.current) {
      window.clearTimeout(blockedActionTimerRef.current);
    }
    blockedActionTimerRef.current = window.setTimeout(() => {
      setBlockedAction(null);
      blockedActionTimerRef.current = null;
    }, 450);
  }

  function chooseSupplier(supplierId: string) {
    const supplier = supplierProductCatalog.find((item) => item.id === supplierId) ?? supplierProductCatalog[0];
    setSelectedSupplierId(supplier.id);
    setSelectedProductCodes([supplier.products[0].code]);
    setNotice(`${supplier.supplier} products loaded.`);
  }

  function toggleSupplierProduct(productCode: string) {
    setSelectedProductCodes((current) => {
      if (current.includes(productCode)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((code) => code !== productCode);
      }

      return [...current, productCode];
    });
  }

  function handleManualImageUpload(file?: File) {
    if (!file) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setManualImagePreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return preview;
    });
    setManualImageName(file.name);
    setNotice(`${file.name} selected for manual upload.`);
  }

  useEffect(() => {
    return () => {
      if (manualImagePreview) {
        URL.revokeObjectURL(manualImagePreview);
      }
      if (blockedActionTimerRef.current) {
        window.clearTimeout(blockedActionTimerRef.current);
      }
    };
  }, [manualImagePreview]);

  return (
    <BuilderShell>
      <section className="builder-main manual-product-page">
        <section className="manual-product-modal manual-product-page-card">
          <header className="manual-product-header">
            <span><UploadIcon size={29} /></span>
            <div><h2>Add product</h2><p>Choose an existing supplier product or add your own product details.</p></div>
            <button aria-label="Close add product page" className="manual-product-close" onClick={() => router.push("/builder/products")} type="button"><XIcon size={24} /></button>
          </header>

          {submissionView === "none" && uploadStage !== "published" ? <section className="manual-product-section">
            <h3>Product source</h3>
            <div className="manual-product-source-toggle">
              <button className={source === "own" ? "active" : ""} onClick={() => setSource("own")} type="button"><UploadIcon size={18} /> Own product</button>
              <button className={source === "supplier" ? "active" : ""} onClick={() => setSource("supplier")} type="button"><BoxIcon size={18} /> Supplier product</button>
            </div>
            {source === "supplier" ? (
              <div className="supplier-product-picker">
                <ManualField icon={<BoxIcon size={20} />} label="Supplier"><select onChange={(event) => chooseSupplier(event.target.value)} value={selectedSupplierId}>{supplierProductCatalog.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.supplier}</option>)}</select></ManualField>
                <div className="supplier-product-picker-note">
                  <strong>Select multiple products</strong>
                  <span>{selectedSupplier.products.length} products available for {selectedSupplier.supplier}.</span>
                </div>
                <div className="supplier-product-list">
                  {selectedSupplier.products.map((product) => (
                    <button
                      aria-pressed={selectedProductCodes.includes(product.code)}
                      className={selectedProductCodes.includes(product.code) ? "active" : ""}
                      key={product.code}
                      onClick={() => toggleSupplierProduct(product.code)}
                      type="button"
                    >
                      <span style={{ backgroundImage: `url("${product.image}")` }} />
                      <div><strong>{product.name}</strong><small>{product.code} &bull; {product.category} &bull; {product.room}</small></div>
                      <em>{product.price}</em>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section> : null}

          {submissionView === "none" && uploadStage !== "published" && source === "own" ? (
            <section className="manual-product-section">
              <h3>How would you like to add it?</h3>
              <div className="manual-product-source-toggle manual-product-source-toggle--sub">
                <button className={ownMode === "invoice" ? "active" : ""} onClick={() => setOwnMode("invoice")} type="button">
                  <UploadIcon size={18} /> PDF / image / invoice
                </button>
                <button className={ownMode === "manual" ? "active" : ""} onClick={() => setOwnMode("manual")} type="button">
                  <ClipboardIcon size={18} /> Manual add
                </button>
              </div>
            </section>
          ) : null}

          {submissionView === "none" && uploadStage !== "published" && source === "own" && ownMode !== "manual" && uploadStage === "form" ? (
            <>
             <section className="manual-product-section manual-product-upload-panel">
                <label className="manual-product-upload-select">
                  Assign to display home
                  <select defaultValue="Tarneit 42 - The Whitmore">
                    <option>Tarneit 42 - The Whitmore</option>
                    <option>Hoppers Crossing - The Delray</option>
                  </select>
                </label>
              </section>
              <section className="manual-product-section manual-product-upload-panel">
                <h3>Upload your PDF, image or invoice</h3>
                
                <p className="manual-product-upload-subtitle">Upload your PDF, image or invoice to start extraction.</p>

                <button className="manual-product-upload-dropzone" onClick={() => setNotice("File picker opened.")} type="button">
                  <UploadIcon size={30} />
                  <strong>Drag & drop your PDF, image or invoice</strong>
                  <small>PDF, image or invoice file</small>
                  <em>Browse file</em>
                </button>               

                <button className="manual-product-upload-primary" onClick={() => { setProcessingStep(0); setUploadStage("processing"); }} type="button">
                  <SparklesIcon size={15} /> Upload & start AI extraction
                </button>
              </section>
            </>
          ) : null}

          {submissionView === "none" && uploadStage !== "published" && source === "own" && ownMode !== "manual" && uploadStage === "processing" ? (
            <section className="manual-product-section manual-product-processing-panel">
              <header className="manual-product-processing-header">
                <span>02</span>
                <div>
                  <h3>AI is reading your file</h3>
                  <p>Whitmore color selection guide - 14 pages</p>
                </div>
              </header>

              <div className="manual-product-processing-list">
                {extractionTasks.map((task, index) => {
                  const rowState =
                    processingStep > index + 1
                      ? "done"
                      : processingStep === index + 1
                        ? "running"
                        : "waiting";
                  const isRunning = rowState === "running";
                  const isDone = rowState === "done";

                  return (
                    <article className={rowState} key={task.label}>
                      <span>{isRunning ? <SparklesIcon size={16} /> : <CheckIcon size={16} />}</span>
                      <strong>{task.label}</strong>
                      <small>{isDone ? "Done" : isRunning ? "Running" : "Waiting"}</small>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {submissionView === "none" && uploadStage !== "published" && source === "own" && ownMode !== "manual" && uploadStage === "results" ? (
            <section className="manual-product-section manual-product-results-panel">
              <PdfPanel
                action={<button onClick={() => setNotice("All products sent to verification.")} type="button">Verify all</button>}
                index="04"
                title="AI extracted products"
              >
                <div className="pdf-extracted-list">
                  {extractedProducts.map((product) => (
                    <article className={product.status} key={product.name}>
                      <span style={{ backgroundImage: `url("${product.image}")` }} />
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.code} - {product.supplier} - {product.confidence}</small>
                        <em>{product.status === "approved" ? "AI matched" : product.status === "pending" ? "No image" : "Flagged"}</em>
                      </div>
                      <button
                        onClick={() => {
                          if (product.status === "flagged") {
                            setNotice(`${product.name} opened for mapping.`);
                            setUploadStage("verify");
                            return;
                          }

                          setNotice(`${product.name} reviewed.`);
                        }}
                        type="button"
                      >
                        {product.status === "flagged" ? "Map" : "Approve"}
                      </button>
                    </article>
                  ))}
                </div>
              </PdfPanel>
              <div className="manual-product-results-footer">
                {/* <button className="manual-product-secondary-action" onClick={() => setNotice("All products sent to verification.")} type="button">
                  <ClipboardIcon size={18} /> Send all to verification
                </button> */}
                <button className="manual-product-primary-action" onClick={() => publishProduct()} type="button">
                  <CheckIcon size={18} /> Publish product
                </button>
              </div>
            </section>
          ) : null}

          {completionState ? (
            <section className={`manual-product-section manual-product-success-panel ${completionState.badgeClass ? "manual-product-draft-panel" : ""}`}>
              <div className={`manual-product-success-badge ${completionState.badgeClass}`}>
                {submissionView === "draft" ? <ClipboardIcon size={28} /> : <CheckIcon size={28} />}
              </div>
              <h3 className={completionState.titleClass}>{completionState.heading}</h3>
              <p>{completionState.description}</p>
              <div className="manual-product-success-actions">
                <button onClick={() => router.push("/builder/products")} type="button">
                  {completionState.primaryLabel}
                </button>
                <button onClick={completionState.primaryAction} type="button">
                  {completionState.buttonLabel}
                </button>
              </div>
            </section>
          ) : null}

          {submissionView === "none" && source === "own" && ownMode !== "manual" && uploadStage === "verify" ? (
            <div className="manual-product-overlay manual-product-overlay--soft manual-product-overlay--verify" role="presentation" onClick={() => setUploadStage("results")}>
              <div className="manual-product-verify-wrap" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                <button aria-label="Close verify modal" className="manual-product-close manual-product-overlay-close" onClick={() => setUploadStage("results")} type="button">
                  <XIcon size={24} />
                </button>
                <VerifyEditStep onNotice={(message) => setNotice(message)} />
              </div>
            </div>
          ) : null}

          {submissionView === "none" && uploadStage !== "published" && source === "own" && ownMode === "manual" ? (
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
          ) : null}
          {submissionView === "none" && uploadStage !== "published" && source === "own" && ownMode === "manual" ? (
            <section className="manual-product-section">
              <h3>Product image</h3>
              <div className="manual-product-image-row">
                <button className="manual-product-upload" onClick={() => manualImageInputRef.current?.click()} type="button">
                  <span
                    style={manualImagePreview ? { backgroundImage: `url("${manualImagePreview}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                  >
                    {manualImagePreview ? null : <UploadIcon size={34} />}
                  </span>
                  <strong>{manualImagePreview ? "Image uploaded" : "Upload image"}</strong>
                  <small>{manualImagePreview ? `${manualImageName} selected` : (<><span>JPG, PNG or WEBP</span><br />Max 10MB</>)}</small>
                </button>
              </div>
              <input
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(event) => handleManualImageUpload(event.target.files?.[0])}
                ref={manualImageInputRef}
                type="file"
              />
            </section>
          ) : null}
          {submissionView === "none" && uploadStage !== "published" && source === "supplier" ? (
            <section className="manual-product-section">
              <h3>Selected supplier products</h3>
              <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {(selectedSupplierProducts.length ? selectedSupplierProducts : [selectedSupplier.products[0]]).map((product) => (
                  <article className="selected-supplier-product" key={product.code}>
                    <span style={{ backgroundImage: `url("${product.image}")` }} />
                    <div>
                      <h4>{product.name}</h4>
                      <p>{selectedSupplier.supplier} &bull; {product.code}</p>
                      <small>{product.category} &bull; Suggested room: {product.room} &bull; {product.price}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {submissionView === "none" && !(source === "own" && ownMode !== "manual" && (uploadStage === "processing" || uploadStage === "verify")) ? (
            <div className="manual-product-info">
              <span>i</span>
              <p>
                <strong>
                  {source === "own"
                    ? ownMode !== "manual"
                      ? "Uploaded products go straight to your verification queue"
                      : "Manually added products go straight to your verification queue"
                    : "Supplier products go straight to your verification queue"}
                </strong>
                <br />
                and require approval before publishing.
              </p>
            </div>
          ) : null}

          {submissionView === "none" && !(source === "own" && ownMode !== "manual" && (uploadStage === "results" || uploadStage === "verify")) ? (
            <footer className="manual-product-footer">
              <button onClick={() => router.push("/builder/products")} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
              <button
                className={blockedAction === "save" ? "is-pulsing" : ""}
                onClick={() => {
                  if (source === "own" && ownMode === "invoice" && uploadStage === "form") {
                    pulseBlockedAction("save");
                    requireExtractionFirst();
                    return;
                  }

                  saveDraft(
                    source === "supplier"
                      ? `${selectedSupplierProducts.length} supplier product${selectedSupplierProducts.length === 1 ? "" : "s"} saved as draft.`
                      : "Your product saved as draft.",
                  );
                }}
                type="button"
              >
                <ClipboardIcon size={19} /> Save as draft
              </button>
              <button
                className={`primary ${blockedAction === "publish" ? "is-pulsing" : ""}`}
                onClick={() => {
                  if (source === "own" && ownMode === "invoice" && uploadStage === "form") {
                    pulseBlockedAction("publish");
                    requireExtractionFirst();
                    return;
                  }

                  publishProduct(
                    source === "supplier"
                      ? `${selectedSupplierProducts.length} supplier product${selectedSupplierProducts.length === 1 ? "" : "s"} published successfully.`
                      : "Product published successfully.",
                  );
                }}
                type="button"
              >
                <CheckIcon size={19} /> Publish
              </button>
            </footer>
          ) : null}
          {submissionView === "none" ? <p className="manual-product-page-notice" role="status">{notice}</p> : null}
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
