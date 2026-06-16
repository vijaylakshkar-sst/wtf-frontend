import { productGuideSteps, type ProductGuideStepId } from "@/components/builder/product-guide/workflow-data";

export function ProductGuideStepper({ activeStep }: { activeStep: ProductGuideStepId }) {
  const activeIndex = productGuideSteps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="create-home-stepper" aria-label="Product guide steps">
      {productGuideSteps.map((step, index) => {
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
            {index < productGuideSteps.length - 1 ? <i aria-hidden="true" /> : null}
          </button>
        );
      })}
    </nav>
  );
}
