"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type ProductsVerifyEditStepProps = {
  onPublish?: () => void;
};

export function ProductsVerifyEditStep({ onPublish = () => {} }: ProductsVerifyEditStepProps) {
  const [approved, setApproved] = useState(false);
  const [published, setPublished] = useState(false);
  const [notice, setNotice] = useState("Review the product details before publishing.");

  const handleApprove = () => {
    setApproved(true);
    setNotice("Product approved and ready to publish.");
  };

  const handlePublish = () => {
    setPublished(true);
    setNotice("Verified product published successfully.");
    onPublish();
  };

  return (
    <StepShell step={createDisplayHomeSteps[7]}>
      <PdfPanel
        index="05"
        title="Verify & edit"
        action={
          <button disabled={!approved || published} onClick={handlePublish} type="button">
            {published ? "Published" : "Publish"}
          </button>
        }
      >
        <div className="pdf-edit-card">
          <span style={{ backgroundImage: `url("/builder_section.png")` }} />
          <div>
            <strong>Calacatta Quartz 20mm</strong>
            <small>AI - p3</small>
          </div>
          <button disabled={approved} onClick={handleApprove} type="button">
            {approved ? "Approved" : "Approve"}
          </button>
        </div>
        <div className="pdf-edit-grid">
          <label>
            Product name
            <input defaultValue="Calacatta Quartz 20mm" />
          </label>
          <label>
            Code
            <input defaultValue="CST-CQ-20" />
          </label>
          <label>
            Supplier
            <select defaultValue="Caesarstone">
              <option>Caesarstone</option>
              <option>Polytec</option>
            </select>
          </label>
          <label>
            Room
            <select defaultValue="Kitchen">
              <option>Kitchen</option>
              <option>Living</option>
            </select>
          </label>
        </div>
        <article className={`pdf-approved-row ${approved ? "active" : ""}`}>
          <CheckIcon size={15} />
          Coastal Oak 6mm
          <strong>{approved ? "Approved" : "Pending"}</strong>
        </article>
      </PdfPanel>
      <div className="product-pdf-notice">{notice}</div>
    </StepShell>
  );
}
