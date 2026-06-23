"use client";

import Link from "next/link";
import { useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon } from "@/components/icons";
import { PdfStepper } from "@/components/builder/products/upload-pdf/pdf-stepper";
import { AiResultsStep } from "@/components/builder/products/upload-pdf/steps/ai-results-step";
import { FlaggedItemsStep } from "@/components/builder/products/upload-pdf/steps/flagged-items-step";
import { PagesScannedStep } from "@/components/builder/products/upload-pdf/steps/pages-scanned-step";
import { PdfUploadStep } from "@/components/builder/products/upload-pdf/steps/pdf-upload-step";
import { ProcessingStep } from "@/components/builder/products/upload-pdf/steps/processing-step";
import { VerifyEditStep } from "@/components/builder/products/upload-pdf/steps/verify-edit-step";
import { pdfWorkflowSteps } from "@/components/builder/products/upload-pdf/workflow-data";

export function ProductPdfUploadPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [notice, setNotice] = useState("Upload a color selection guide, invoice or spec sheet to begin extraction.");
  const currentStep = pdfWorkflowSteps[activeStep];

  return (
    <BuilderShell>
      <section className="builder-main product-pdf-main">
        <div className="product-pdf-shell">
          <header className="product-pdf-header">
            <div className="product-pdf-breadcrumb">
              <Link href="/builder/products">Product library</Link>
              <ArrowIcon size={14} />
              <span>PDF upload & AI extraction</span>
            </div>
            <PdfStepper activeStep={activeStep} onSelectStep={setActiveStep} />
          </header>

          <div className="product-pdf-single">
            {activeStep === 0 ? <PdfUploadStep onAdvance={() => setActiveStep(1)} onNotice={setNotice} /> : null}
            {activeStep === 1 ? <ProcessingStep /> : null}
            {activeStep === 2 ? <PagesScannedStep /> : null}
            {activeStep === 3 ? <AiResultsStep onNotice={setNotice} /> : null}
            {activeStep === 4 ? <VerifyEditStep onNotice={setNotice} /> : null}
            {activeStep === 5 ? <FlaggedItemsStep onNotice={setNotice} /> : null}
          </div>
          <div className="product-pdf-info"><span>i</span><p><strong>All extracted products go straight to your verification queue for approval before publishing.</strong><br />You can manage and map all products later from the product library.</p></div>
          <footer className="product-pdf-actions">
            <button disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(0, step - 1))} type="button">Back</button>
            <button className="pdf-primary" disabled={activeStep === pdfWorkflowSteps.length - 1} onClick={() => setActiveStep((step) => Math.min(pdfWorkflowSteps.length - 1, step + 1))} type="button">{activeStep === 4 ? "Publish" : activeStep === 5 ? "Done" : "Next step"} <ArrowIcon size={14} /></button>
          </footer>
          <p className="product-pdf-notice" role="status">{currentStep}: {notice}</p>
        </div>
      </section>
    </BuilderShell>
  );
}
