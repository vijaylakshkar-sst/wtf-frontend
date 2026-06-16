import { SparklesIcon, UploadIcon } from "@/components/icons";
import { StepShell } from "@/components/builder/product-guide/step-shell";
import { productGuideSteps } from "@/components/builder/product-guide/workflow-data";

export function ProductGuideUploadStep() {
  return (
    <StepShell step={productGuideSteps[0]}>
      <div className="create-home-ai-callout">
        <SparklesIcon size={22} />
        <div>
          <strong>AI-powered Product Guide</strong>
          <p>Upload your products - AI identifies products, categories, product codes and colours. Review before publishing.</p>
        </div>
      </div>
      <div className="create-home-dropzone">
        <span><UploadIcon size={31} /></span>
        <strong>Drag & drop your product guide</strong>
        <button type="button"><UploadIcon size={15} /> Browse files</button>
      </div>
    </StepShell>
  );
}
