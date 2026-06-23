import { colorSelectionGuideSteps, type ColorSelectionGuideStepId } from "@/components/builder/color-selection-guide/workflow-data";

export function ColorSelectionGuideStepper({ activeStep }: { activeStep: ColorSelectionGuideStepId }) {
  const activeIndex = colorSelectionGuideSteps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="create-home-stepper" aria-label="Color Selection guide steps">
      {colorSelectionGuideSteps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete = index < activeIndex;
        return (
          <button
            key={step.id}
            aria-current={isActive ? "step" : undefined}
            className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
            disabled
            type="button"
          >
            <span className="create-home-step-dot">{isComplete ? "\u2713" : step.shortLabel}</span>
            <span className="create-home-step-label">{step.title}</span>
            {index < colorSelectionGuideSteps.length - 1 ? <i aria-hidden="true" /> : null}
          </button>
        );
      })}
    </nav>
  );
}
