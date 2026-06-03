"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon } from "@/components/icons";
import { CreateStepper } from "@/components/builder/display-homes/create/create-stepper";
import { createDisplayHomeSteps, type CreateDisplayHomeStepId } from "@/components/builder/display-homes/create/workflow-data";
import { ClassificationStep } from "@/components/builder/display-homes/create/steps/classification-step";
import { DetailsStep } from "@/components/builder/display-homes/create/steps/details-step";
import { FloorPlanStep } from "@/components/builder/display-homes/create/steps/floor-plan-step";
import { QrStep } from "@/components/builder/display-homes/create/steps/qr-step";
import { RoomsStep } from "@/components/builder/display-homes/create/steps/rooms-step";

const stepComponents: Record<CreateDisplayHomeStepId, React.ComponentType> = {
  details: DetailsStep,
  classification: ClassificationStep,
  "floor-plan": FloorPlanStep,
  rooms: RoomsStep,
  qr: QrStep,
};

export function CreateDisplayHomePage() {
  const [activeStep, setActiveStep] = useState<CreateDisplayHomeStepId>("details");
  const activeIndex = createDisplayHomeSteps.findIndex((step) => step.id === activeStep);
  const ActiveStep = stepComponents[activeStep];
  const isFinalSubmitStep = activeStep === "rooms";

  const nextStep = useMemo(() => createDisplayHomeSteps[Math.min(activeIndex + 1, createDisplayHomeSteps.length - 1)]?.id, [activeIndex]);
  const previousStep = useMemo(() => createDisplayHomeSteps[Math.max(activeIndex - 1, 0)]?.id, [activeIndex]);

  return (
    <BuilderShell>
      <section className="builder-main create-home-main">
        <div className="create-home-shell">
          <header className="create-home-header">
            <div className="create-home-breadcrumb">
              <Link href="/builder/display-homes">Create display home</Link>
              <ArrowIcon size={16} />
              <span>{createDisplayHomeSteps[activeIndex].eyebrow} of {createDisplayHomeSteps.length}: {createDisplayHomeSteps[activeIndex].title}</span>
            </div>
            <CreateStepper activeStep={activeStep} onSelectStep={setActiveStep} />
          </header>
          <ActiveStep />
          <footer className="create-home-workflow-actions">
            <button disabled={activeIndex === 0} onClick={() => setActiveStep(previousStep)} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
            <button className="create-home-primary" disabled={activeIndex === createDisplayHomeSteps.length - 1} onClick={() => setActiveStep(nextStep)} type="button">
              {isFinalSubmitStep ? "Final submit" : "Next step"} <ArrowIcon size={15} />
            </button>
          </footer>
        </div>
      </section>
    </BuilderShell>
  );
}
