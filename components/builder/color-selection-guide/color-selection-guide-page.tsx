"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon } from "@/components/icons";
import { ColorSelectionGuideStepper } from "@/components/builder/color-selection-guide/color-selection-guide-stepper";
import { ColourReviewStep } from "@/components/builder/color-selection-guide/steps/color-selection-guide-colour-review-step";
import { ColorSelectionGuideUploadStep } from "@/components/builder/color-selection-guide/steps/color-selection-guide-upload-step";
import { ColorSelectionGuideSuccessStep } from "@/components/builder/color-selection-guide/steps/color-selection-guide-success-step";
import { colorSelectionGuideSteps, type ColorSelectionGuideStepId } from "@/components/builder/color-selection-guide/workflow-data";

type ColorSelectionGuideStepComponent = ComponentType<any>;

const stepComponents: Record<ColorSelectionGuideStepId, ColorSelectionGuideStepComponent> = {
  upload: ColorSelectionGuideUploadStep,
  "colour-review": ColourReviewStep,
  success: ColorSelectionGuideSuccessStep,
};

export function ColorSelectionGuidePage() {
  const [activeStep, setActiveStep] = useState<ColorSelectionGuideStepId>("upload");
  const [notice, setNotice] = useState("Color Selection guide ready.");
  const successMessage = "Your guide is now available for builders to use in the separate colour selection workflow.";

  const activeIndex = colorSelectionGuideSteps.findIndex((step) => step.id === activeStep);
  const nextStep = useMemo(
    () => colorSelectionGuideSteps[Math.min(activeIndex + 1, colorSelectionGuideSteps.length - 1)]?.id,
    [activeIndex],
  );
  const previousStep = useMemo(
    () => colorSelectionGuideSteps[Math.max(activeIndex - 1, 0)]?.id,
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
              <span>{colorSelectionGuideSteps[activeIndex].eyebrow} of {colorSelectionGuideSteps.length}: {colorSelectionGuideSteps[activeIndex].title}</span>
            </div>
            <ColorSelectionGuideStepper activeStep={activeStep} />
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
