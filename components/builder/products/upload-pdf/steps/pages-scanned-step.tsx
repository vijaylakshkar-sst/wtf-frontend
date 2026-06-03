import { FileIcon } from "@/components/icons";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { scannedPages } from "@/components/builder/products/upload-pdf/workflow-data";

export function PagesScannedStep() {
  return (
    <PdfPanel index="03" title="Pages scanned">
      <div className="pdf-scan-stats"><span><small>Pages</small>14</span><span><small>Products</small>28</span><span><small>Images matched</small>23</span><span><small>Needs review</small>2</span></div>
      <div className="pdf-page-grid">{scannedPages.map((page) => <button className={page.state} key={page.page} type="button"><FileIcon size={16} /><span>{page.page}</span><small>{page.products}</small></button>)}</div>
      <p className="pdf-warning">Pages 12-14 could not be fully read. Products flagged for manual review.</p>
    </PdfPanel>
  );
}
