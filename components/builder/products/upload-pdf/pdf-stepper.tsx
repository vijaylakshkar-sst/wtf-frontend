import { pdfWorkflowSteps } from "@/components/builder/products/upload-pdf/workflow-data";

export function PdfStepper({ activeStep, onSelectStep }: { activeStep: number; onSelectStep: (step: number) => void }) {
  return (
    <nav className="product-pdf-stepper" aria-label="Product PDF upload steps">
      {pdfWorkflowSteps.map((step, index) => (
        <button className={`${index === activeStep ? "active" : ""} ${index < activeStep ? "complete" : ""}`} key={step} onClick={() => onSelectStep(index)} type="button">
          <span>{index < activeStep ? "\u2713" : index + 1}</span>{step}<i />
        </button>
      ))}
    </nav>
  );
}
