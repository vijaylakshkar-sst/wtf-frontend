"use client";

import type { CreateDisplayHomeStepId } from "@/components/builder/display-homes/create/workflow-data";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";

export function CreateStepper({ activeStep }: { activeStep: CreateDisplayHomeStepId }) {
  const activeIndex = createDisplayHomeSteps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="create-home-stepper" aria-label="Create display home steps">
      {createDisplayHomeSteps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete = index < activeIndex;
        return (
          <button key={step.id} aria-current={isActive ? "step" : undefined} className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} disabled type="button">
            <span className="create-home-step-dot">{isComplete ? "\u2713" : step.shortLabel}</span>
            <span className="create-home-step-label">{step.title}</span>
            {index < createDisplayHomeSteps.length - 1 ? <i aria-hidden="true" /> : null}
          </button>
        );
      })}
    </nav>
  );
}
