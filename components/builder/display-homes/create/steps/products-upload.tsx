import { SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function ProductUploadStep() {
  return (
    <StepShell step={createDisplayHomeSteps[4]}>
      <div className="create-home-ai-callout">
        <SparklesIcon size={22} />
        <div>
          <strong>AI-powered Product Guide</strong>
          <p>Upload your Products - AI identifies products,category, product codes, colors. You review before publishing.</p>
        </div>
      </div>
      <div className="create-home-dropzone">
        <span><UploadIcon size={31} /></span>
        <strong>Drag & drop your Product guide</strong>       
        <button type="button"><UploadIcon size={15} /> Browse files</button>
      </div>      
    </StepShell>
  );
}
