"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon } from "@/components/icons";
import { ProductGuideStepper } from "@/components/builder/product-guide/product-guide-stepper";
import { ColourReviewStep } from "@/components/builder/product-guide/steps/colour-review-step";
import { ProductGuideUploadStep } from "@/components/builder/product-guide/steps/product-guide-upload-step";
import { ProductGuideSuccessStep } from "@/components/builder/product-guide/steps/product-guide-success-step";
import { productGuideSteps, type ProductGuideStepId } from "@/components/builder/product-guide/workflow-data";

type ProductGuideStepComponent = ComponentType<Record<string, unknown>>;

const stepComponents: Record<ProductGuideStepId, ProductGuideStepComponent> = {
  upload: ProductGuideUploadStep,
  "colour-review": ColourReviewStep,
  success: ProductGuideSuccessStep,
};

export function ProductGuidePage() {
  const [activeStep, setActiveStep] = useState<ProductGuideStepId>("upload");
  const [notice, setNotice] = useState("Product guide ready.");
  const successMessage = "Your guide is now available for builders to use in the separate product guide workflow.";

  const activeIndex = productGuideSteps.findIndex((step) => step.id === activeStep);
  const nextStep = useMemo(
    () => productGuideSteps[Math.min(activeIndex + 1, productGuideSteps.length - 1)]?.id,
    [activeIndex],
  );
  const previousStep = useMemo(
    () => productGuideSteps[Math.max(activeIndex - 1, 0)]?.id,
    [activeIndex],
  );

  const renderActiveStep = () => {
    const ActiveStep = stepComponents[activeStep];
    return activeStep === "success"
      ? <ActiveStep message={successMessage} />
      : <ActiveStep onNotice={setNotice} />;
  };

  return (
    <BuilderShell>
      <section className="builder-main create-home-main">
        <div className="create-home-shell wide" style={{ maxWidth: "none", width: "100%" }}>
          <header className="create-home-header">
            <div className="create-home-breadcrumb">
              <Link href="/builder/products">Products</Link>
              <ArrowIcon size={16} />
              <span>{productGuideSteps[activeIndex].eyebrow} of {productGuideSteps.length}: {productGuideSteps[activeIndex].title}</span>
            </div>
            <ProductGuideStepper activeStep={activeStep} />
          </header>

          <div className="create-home-workflow-stage">
            {renderActiveStep()}
          </div>

          {activeStep !== "success" ? (
            <footer className="create-home-workflow-actions">
              <button disabled={activeIndex === 0} onClick={() => setActiveStep(previousStep)} type="button">
                <span aria-hidden="true">&#8592;</span> Back
              </button>
              <button
                className="create-home-primary"
                disabled={false}
                onClick={() => {
                  if (!nextStep) {
                    return;
                  }

                  setActiveStep(nextStep);
                }}
                type="button"
              >
                Next step <ArrowIcon size={15} />
              </button>
            </footer>
          ) : null}

          {activeStep !== "success" ? <p className="product-pdf-notice" role="status">{notice}</p> : null}
        </div>
      </section>
    </BuilderShell>
  );
}
