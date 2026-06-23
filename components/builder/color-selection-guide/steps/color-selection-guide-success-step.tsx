import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { ColorSelectionGuideStepShell } from "@/components/builder/color-selection-guide/step-shell";
import { colorSelectionGuideSteps } from "@/components/builder/color-selection-guide/workflow-data";

type ColorSelectionGuideSuccessStepProps = {
  message: string;
  ctaLabel?: string;
};

export function ColorSelectionGuideSuccessStep({ ctaLabel = "Click to Add Product", message }: ColorSelectionGuideSuccessStepProps) {
  return (
    <ColorSelectionGuideStepShell step={colorSelectionGuideSteps[2]}>
      <section className="create-home-qr-card">
        <div className="create-home-qr-success">
          <span><CheckIcon size={36} /></span>
          <h3>Color Selection guide added successfully</h3>
          <p>{message}</p>
        </div>
        <div className="create-home-qr-actions">
          <Link className="create-home-primary" href="/builder/products">{ctaLabel}</Link>
        </div>
      </section>
    </ColorSelectionGuideStepShell>
  );
}
