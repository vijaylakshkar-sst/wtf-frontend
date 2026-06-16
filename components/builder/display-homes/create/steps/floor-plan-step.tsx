"use client";

import { useEffect, useMemo, useState } from "react";
import { SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type FloorPlanStepProps = {
  onValidityChange?: (isValid: boolean) => void;
  validationAttempt?: number;
};

function isAllowedUpload(file: File | null) {
  return Boolean(file && (file.type.startsWith("image/") || file.type === "application/pdf"));
}

export function FloorPlanStep({ onValidityChange, validationAttempt = 0 }: FloorPlanStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const shouldShowValidation = validationAttempt > 0;
  const isValidUpload = useMemo(() => isAllowedUpload(selectedFile), [selectedFile]);

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    onValidityChange?.(isValidUpload);
  }, [isValidUpload, onValidityChange]);

  const hasFile = Boolean(selectedFile);
  const isImage = Boolean(selectedFile && selectedFile.type.startsWith("image/"));
  const validationError = shouldShowValidation && !selectedFile
    ? "Upload a floor plan to continue."
    : shouldShowValidation && selectedFile && !isAllowedUpload(selectedFile)
      ? "Please upload an image or PDF file."
      : "";

  return (
    <StepShell step={createDisplayHomeSteps[2]}>
      <section className="create-home-floor-plan-card create-home-floor-plan-card--simple">
        <div className="create-home-ai-callout">
          <SparklesIcon size={22} />
          <div>
            <strong>Floor plan upload</strong>
            <p>Upload the plan here and the image will show in the box below. Step 4 handles the ground floor and first floor room review.</p>
          </div>
        </div>

        <div className="create-home-floor-plan-card-header">
          <div>
            <span className="create-home-floor-plan-eyebrow">Uploaded plan</span>
            <h3>Drop the floor plan and preview it here</h3>
            <p>The box below stays simple like a classic upload area, and after upload we show the image inside it.</p>
          </div>
        </div>

        <div className={`create-home-dropzone create-home-floor-plan-dropzone${shouldShowValidation && !isValidUpload ? " invalid" : ""}`}>
          {selectedFile && previewUrl ? (
            <>
              <img alt="Uploaded floor plan preview" className="create-home-floor-plan-image" src={previewUrl} />
              <strong>{selectedFile.name}</strong>
              <small>Image preview</small>
            </>
          ) : selectedFile && selectedFile.type === "application/pdf" ? (
            <>
              <span><UploadIcon size={31} /></span>
              <strong>{selectedFile.name}</strong>
              <small>PDF uploaded. Preview will be generated after the next step.</small>
            </>
          ) : (
            <>
              <span><UploadIcon size={31} /></span>
              <strong>Drag & drop your floor plan</strong>
              <small>Image or PDF only</small>
            </>
          )}
          <label className="create-home-primary create-home-floor-plan-upload-btn">
            <UploadIcon size={15} />
            {selectedFile ? "Replace file" : "Browse files"}
            <input
              accept="image/*,application/pdf"
              aria-label="Upload floor plan"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (!file) {
                  setSelectedFile(null);
                  return;
                }

                if (file.type.startsWith("image/") || file.type === "application/pdf") {
                  setSelectedFile(file);
                  return;
                }

                setSelectedFile(file);
              }}
              type="file"
            />
          </label>
        </div>

        <p className="create-home-field-error create-home-floor-plan-error" aria-hidden={!validationError}>
          {validationError || "\u00A0"}
        </p>

        <div className="create-home-floor-plan-caption">
          <div>
            <strong>{selectedFile ? "Uploaded file ready" : "No file uploaded yet"}</strong>
            <p>{selectedFile ? (isImage ? "This image is shown directly in the upload box." : "This PDF is ready for processing in the next step.") : "Upload a PNG, JPG, or PDF to continue."}</p>
          </div>
          <small>{selectedFile ? "Ready for step 4 room review" : "Upload to continue"}</small>
        </div>
      </section>
    </StepShell>
  );
}
