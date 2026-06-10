import { CheckIcon, FileIcon, PrintIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function QrStep() {
  return (
    <StepShell step={createDisplayHomeSteps[8]}>
      <div className="create-home-qr-success">
        <span><CheckIcon size={36} /></span>
        <h3>Display home published</h3>
        <p>Tarneit 42 - The Whitmore is now live</p>
      </div>
      <section className="create-home-qr-card">
        <div className="create-home-qr-code" aria-label="QR code preview">
          {Array.from({ length: 49 }).map((_, index) => <i key={index} className={index % 3 === 0 || index % 7 === 0 ? "filled" : ""} />)}
        </div>
        <strong>Tarneit 42 - The Whitmore</strong>
        <p>buildportal.com.au/visit/TW-4291</p>
        <div className="create-home-qr-actions">
          <button className="create-home-primary" type="button"><UploadIcon size={15} /> PNG</button>
          <button className="create-home-secondary" type="button"><FileIcon size={15} /> PDF</button>
          <button className="create-home-secondary" type="button"><PrintIcon size={15} /> Print</button>
        </div>
      </section>
    </StepShell>
  );
}
