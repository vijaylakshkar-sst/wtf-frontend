import { BookOpenIcon, SparklesIcon, UploadIcon } from "@/components/icons";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";

export function PdfUploadStep({ onAdvance, onNotice }: { onAdvance: () => void; onNotice: (notice: string) => void }) {
  return (
    <PdfPanel index="01" title="Upload your PDF" subtitle="Upload your product guide, invoice or spec sheet.">
      <div className="pdf-type-grid">
        {["Product guide", "Invoice", "Spec sheet"].map((item, index) => <button className={index === 0 ? "active" : ""} key={item} onClick={() => onNotice(`${item} selected.`)} type="button"><BookOpenIcon size={18} />{item}</button>)}
      </div>
      <button className="pdf-dropzone" onClick={() => { onAdvance(); onNotice("PDF uploaded. AI extraction started."); }} type="button">
        <UploadIcon size={32} />
        <strong>Drag & drop your PDF</strong>
        <small>Product guide, invoice or spec sheet</small>
        <em>Browse PDF</em>
      </button>
      <label className="pdf-select">Assign to display home<select defaultValue="Tarneit 42 - The Whitmore"><option>Tarneit 42 - The Whitmore</option><option>Hoppers Crossing - The Delray</option></select></label>
      <button className="pdf-primary" onClick={() => { onAdvance(); onNotice("AI extraction running."); }} type="button"><SparklesIcon size={15} /> Upload & start AI extraction</button>
    </PdfPanel>
  );
}
