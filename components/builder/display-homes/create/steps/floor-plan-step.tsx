import { SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function FloorPlanStep() {
  return (
    <StepShell step={createDisplayHomeSteps[2]}>
      <div className="create-home-ai-callout">
        <SparklesIcon size={22} />
        <div>
          <strong>AI-powered room mapping</strong>
          <p>Upload your floor plan - AI identifies rooms, names, structure and suggests product associations. You review before publishing.</p>
        </div>
      </div>
      <div className="create-home-dropzone">
        <span><UploadIcon size={31} /></span>
        <strong>Drag & drop your floor plan</strong>
        <small>PDF - PNG - JPG - CAD (future)</small>
        <button type="button"><UploadIcon size={15} /> Browse files</button>
      </div>
      <footer className="create-home-panel-actions">
        <button className="create-home-secondary" type="button">Skip AI mapping</button>
        <button className="create-home-primary" type="button"><SparklesIcon size={15} /> Upload & analyse</button>
      </footer>
    </StepShell>
  );
}
