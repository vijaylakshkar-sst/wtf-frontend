import { FileIcon, SparklesIcon, UploadIcon } from "@/components/icons";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";

export function PdfUploadStep({ onAdvance, onNotice }: { onAdvance: () => void; onNotice: (notice: string) => void }) {
  return (
    <PdfPanel index="01" title="Upload your file" subtitle="Upload your invoice or CSV to begin extraction.">
      <div className="pdf-type-grid">
        {["Invoice", "CSV"].map((item, index) => <button className={index === 0 ? "active" : ""} key={item} onClick={() => onNotice(`${item} selected.`)} type="button"><FileIcon size={18} />{item}</button>)}
      </div>
      <button className="pdf-dropzone" onClick={() => { onAdvance(); onNotice("File uploaded. AI extraction started."); }} type="button">
        <UploadIcon size={32} />
        <strong>Drag & drop your file</strong>
        <small>Invoice or CSV</small>
        <em>Browse file</em>
      </button>
      <label className="pdf-select">Assign to display home<select defaultValue="Tarneit 42 - The Whitmore"><option>Tarneit 42 - The Whitmore</option><option>Hoppers Crossing - The Delray</option></select></label>
      <button className="pdf-primary" onClick={() => { onAdvance(); onNotice("AI extraction running."); }} type="button"><SparklesIcon size={15} /> Upload & start AI extraction</button>
    </PdfPanel>
  );
}
