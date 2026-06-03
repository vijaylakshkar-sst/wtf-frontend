import { FlagIcon } from "@/components/icons";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { flaggedPdfItems } from "@/components/builder/products/upload-pdf/workflow-data";

export function FlaggedItemsStep({ onNotice }: { onNotice: (notice: string) => void }) {
  return (
    <PdfPanel index="06" title="Flagged products">
      <p className="pdf-panel-note">Products could not be identified by AI. Save, map or send to admin.</p>
      <div className="pdf-flag-list">
        {flaggedPdfItems.map((item) => <article key={item.title}><FlagIcon size={18} /><div><strong>{item.title}</strong><small>{item.note}</small></div><button onClick={() => onNotice(`${item.title} opened for mapping.`)} type="button">Map</button></article>)}
      </div>
    </PdfPanel>
  );
}
