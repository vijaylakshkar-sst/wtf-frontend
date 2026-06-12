"use client";

import { useEffect, useState } from "react";
import { SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function FloorPlanStep() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

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

        <div className="create-home-dropzone create-home-floor-plan-dropzone">
          {selectedFile && previewUrl ? (
            <>
              <img alt="Uploaded floor plan preview" className="create-home-floor-plan-image" src={previewUrl} />
              <strong>{selectedFile.name}</strong>
              <small>Uploaded file preview</small>
            </>
          ) : selectedFile ? (
            <>
              <span><UploadIcon size={31} /></span>
              <strong>{selectedFile.name}</strong>
              <small>Uploaded file is not an image. Please use PNG or JPG to preview inside the box.</small>
            </>
          ) : (
            <>
              <span><UploadIcon size={31} /></span>
              <strong>Drag & drop your floor plan</strong>
              <small>PDF - PNG - JPG - CAD (future)</small>
            </>
          )}
          <label className="create-home-primary create-home-floor-plan-upload-btn">
            <UploadIcon size={15} />
            {selectedFile ? "Replace file" : "Browse files"}
            <input
              accept="image/*,application/pdf"
              aria-label="Upload floor plan"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
        </div>

        <div className="create-home-floor-plan-caption">
          <div>
            <strong>{selectedFile ? "Uploaded file preview" : "No file uploaded yet"}</strong>
            <p>{selectedFile ? "This is the file you uploaded, shown directly in the upload box." : "Once uploaded, the floor plan will replace this placeholder inside the same box."}</p>
          </div>
          <small>{selectedFile ? "Ready for step 4 room review" : "Upload to continue"}</small>
        </div>
      </section>
    </StepShell>
  );
}
