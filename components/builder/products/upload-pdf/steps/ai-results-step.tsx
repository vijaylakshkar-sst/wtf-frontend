import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { extractedProducts } from "@/components/builder/products/upload-pdf/workflow-data";

export function AiResultsStep({ onNotice }: { onNotice: (notice: string) => void }) {
  return (
    <PdfPanel index="04" title="AI extracted products" action={<button onClick={() => onNotice("All products sent to verification.")} type="button">Verify all</button>}>
      <div className="pdf-extracted-list">
        {extractedProducts.map((product) => <article className={product.status} key={product.name}><span style={{ backgroundImage: `url("${product.image}")` }} /><div><strong>{product.name}</strong><small>{product.code} - {product.supplier} - {product.confidence}</small><em>{product.status === "approved" ? "AI matched" : product.status === "pending" ? "No image" : "Flagged"}</em></div><button onClick={() => onNotice(`${product.name} reviewed.`)} type="button">{product.status === "flagged" ? "Map" : "Approve"}</button></article>)}
      </div>
    </PdfPanel>
  );
}
