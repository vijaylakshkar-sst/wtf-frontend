import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { StepShell } from "@/components/builder/product-guide/step-shell";
import { productGuideSteps } from "@/components/builder/product-guide/workflow-data";

type ProductGuideSuccessStepProps = {
  message: string;
  ctaLabel?: string;
};

export function ProductGuideSuccessStep({ ctaLabel = "Click to Add Product", message }: ProductGuideSuccessStepProps) {
  return (
    <StepShell step={productGuideSteps[2]}>
      <section className="create-home-qr-card">
        <div className="create-home-qr-success">
          <span><CheckIcon size={36} /></span>
          <h3>Product guide added successfully</h3>
          <p>{message}</p>
        </div>
        <div className="create-home-qr-actions">
          <Link className="create-home-primary" href="/builder/products">{ctaLabel}</Link>
        </div>
      </section>
    </StepShell>
  );
}
