import { CheckIcon } from "@/components/icons";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { extractionTasks } from "@/components/builder/products/upload-pdf/workflow-data";

export function ProcessingStep() {
  return (
    <PdfPanel index="02" title="AI is reading your PDF" subtitle="Whitmore product guide.pdf - 14 pages">
      <div className="pdf-task-list">
        {extractionTasks.map((task) => <article className={task.tone} key={task.label}><CheckIcon size={15} /><span>{task.label}</span><strong>{task.status}</strong></article>)}
      </div>
    </PdfPanel>
  );
}
