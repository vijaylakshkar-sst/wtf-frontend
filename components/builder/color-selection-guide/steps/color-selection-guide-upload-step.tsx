import { SparklesIcon, UploadIcon } from "@/components/icons";
import { ColorSelectionGuideStepShell } from "@/components/builder/color-selection-guide/step-shell";
import { colorSelectionGuideSteps } from "@/components/builder/color-selection-guide/workflow-data";

export function ColorSelectionGuideUploadStep() {
  return (
    <ColorSelectionGuideStepShell step={colorSelectionGuideSteps[0]}>
      <div className="create-home-ai-callout">
        <SparklesIcon size={22} />
        <div>
          <strong>AI-powered Color Selection guide</strong>
          <p>Upload your products - AI identifies products, categories, product codes and colours. Review before publishing.</p>
        </div>
      </div>
      <div className="create-home-dropzone">
        <span><UploadIcon size={31} /></span>
        <strong>Drag & drop your colour selection guide</strong>
        <button type="button"><UploadIcon size={15} /> Browse files</button>
      </div>
    </ColorSelectionGuideStepShell>
  );
}
