import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { extractedProducts } from "@/components/builder/display-homes/create/workflow-data";
import { CheckIcon, SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function ProductsVerifyEditStep() {
    return (
        <StepShell step={createDisplayHomeSteps[6]}>
            <PdfPanel index="05" title="Verify & edit" action={<button type="button">Publish</button>}>
                <div className="pdf-edit-card">
                    <span style={{ backgroundImage: `url("/builder_section.png")` }} />
                    <div><strong>Calacatta Quartz 20mm</strong><small>AI - p3</small></div>
                    <button type="button">Approve</button>
                </div>
                <div className="pdf-edit-grid">
                    <label>Product name<input defaultValue="Calacatta Quartz 20mm" /></label>
                    <label>Code<input defaultValue="CST-CQ-20" /></label>
                    <label>Supplier<select defaultValue="Caesarstone"><option>Caesarstone</option><option>Polytec</option></select></label>
                    <label>Room<select defaultValue="Kitchen"><option>Kitchen</option><option>Living</option></select></label>
                </div>
                <article className="pdf-approved-row"><CheckIcon size={15} /> Coastal Oak 6mm <strong>Approved</strong></article>
            </PdfPanel>

        </StepShell>
    );
}