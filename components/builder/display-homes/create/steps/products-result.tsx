import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { extractedProducts } from "@/components/builder/display-homes/create/workflow-data";
import { SparklesIcon, UploadIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

export function AiProductResultsStep() {
    return (
        <StepShell step={createDisplayHomeSteps[5]}>
            <div className="create-home-ai-callout">
                <SparklesIcon size={22} />
                <div>
                    <strong>AI-powered Products</strong>
                    <p>Upload your Products - AI identifies products,category, product codes, colors. You review before publishing.</p>
                </div>
            </div>

            <PdfPanel index="04" title="AI extracted products" action={<button type="button">Verify all</button>}>
                <div className="pdf-extracted-list">
                    {extractedProducts.map((product) => <article className={product.status} key={product.name}><span style={{ backgroundImage: `url("${product.image}")` }} /><div><strong>{product.name}</strong><small>{product.code} - {product.supplier} - {product.confidence}</small><em>{product.status === "approved" ? "AI matched" : product.status === "pending" ? "No image" : "Flagged"}</em></div><button type="button">{product.status === "flagged" ? "Map" : "Approve"}</button></article>)}
                </div>
            </PdfPanel>

        </StepShell>
    );
}