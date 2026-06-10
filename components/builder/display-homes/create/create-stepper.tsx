"use client";

import type { CreateDisplayHomeStepId } from "@/components/builder/display-homes/create/workflow-data";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";

export function CreateStepper({ activeStep, onSelectStep }: { activeStep: CreateDisplayHomeStepId; onSelectStep: (step: CreateDisplayHomeStepId) => void }) {
  const activeIndex = createDisplayHomeSteps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="create-home-stepper" aria-label="Create display home steps">
      {createDisplayHomeSteps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete = index < activeIndex;
        return (
          <button className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} key={step.id} onClick={() => onSelectStep(step.id)} type="button">
            <span className="create-home-step-dot">{isComplete ? "\u2713" : step.shortLabel}</span>
            <span className="create-home-step-label">{step.title}</span>
            {index < createDisplayHomeSteps.length - 1 ? <i aria-hidden="true" /> : null}
          </button>
        );
      })}
    </nav>
  );
}
