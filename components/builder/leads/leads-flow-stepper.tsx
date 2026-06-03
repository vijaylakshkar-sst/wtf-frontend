import { leadsFlowSteps } from "@/components/builder/leads/data";

export function LeadsFlowStepper({ activeStep, onSelectStep }: { activeStep: number; onSelectStep: (step: number) => void }) {
  return (
    <nav className="leads-flow-stepper" aria-label="Leads workflow steps">
      {leadsFlowSteps.map((step, index) => (
        <button className={`${activeStep === index ? "active" : ""} ${activeStep > index ? "complete" : ""}`} key={step} onClick={() => onSelectStep(index)} type="button">
          <span>{activeStep > index ? "\u2713" : index + 1}</span>{step}<i />
        </button>
      ))}
    </nav>
  );
}
